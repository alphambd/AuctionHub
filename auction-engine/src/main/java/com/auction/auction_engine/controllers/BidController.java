package com.auction.auction_engine.controllers;

import com.auction.auction_engine.dto.BidDTO;
import com.auction.auction_engine.dto.BidRequest;
import com.auction.auction_engine.dto.UserSummaryDTO;
import com.auction.auction_engine.dto.ProductSummaryDTO;
import com.auction.auction_engine.entities.Bid;
import com.auction.auction_engine.entities.Product;
import com.auction.auction_engine.entities.User;
import com.auction.auction_engine.repositories.BidRepository;
import com.auction.auction_engine.repositories.ProductRepository;
import com.auction.auction_engine.repositories.UserRepository;
import com.auction.auction_engine.services.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "http://localhost:4200")
public class BidController {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebSocketService webSocketService;

    @PostMapping
    public ResponseEntity<BidDTO> placeBid(@RequestBody BidRequest bidRequest) {
        // 1. Récupérer l'utilisateur connecté depuis le token JWT
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Récupère l'email (subject du token)

        User bidder = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Utilisateur non trouvé avec l'email: " + email
                ));

        // 2. Vérifier que le produit existe
        Product product = productRepository.findById(bidRequest.getProductId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Produit non trouvé avec l'id: " + bidRequest.getProductId()
                ));

        // 3. Vérifier que le produit est actif
        if (!product.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ce produit n'est plus actif"
            );
        }

        // 4. Vérifier que la date de fin n'est pas dépassée
        if (product.getEndTime().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Les enchères sont terminées pour ce produit"
            );
        }

        // 5. Vérifier que le montant est supérieur au prix actuel
        if (bidRequest.getAmount() <= product.getCurrentPrice()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Le montant doit être supérieur au prix actuel (" + product.getCurrentPrice() + "€)"
            );
        }

        // 6. Vérifier que l'utilisateur n'est pas le vendeur
        if (bidder.getId().equals(product.getSeller().getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vous ne pouvez pas enchérir sur votre propre produit"
            );
        }

        // 7. Créer et sauvegarder l'enchère
        Bid bid = new Bid();
        bid.setAmount(bidRequest.getAmount());
        bid.setUser(bidder);  // Utilise l'utilisateur connecté
        bid.setProduct(product);
        bid.setCreatedAt(LocalDateTime.now());

        Bid savedBid = bidRepository.save(bid);

        // 8. Mettre à jour le prix courant du produit
        product.setCurrentPrice(bidRequest.getAmount());
        productRepository.save(product);

        // 9. Diffuser l'information en temps réel
        String bidderFullName = bidder.getFirstName() + " " + bidder.getLastName();
        webSocketService.broadcastBidUpdate(
                product.getId(),
                bidRequest.getAmount(),
                bidderFullName
        );

        // 10. Retourner l'enchère créée
        return new ResponseEntity<>(convertToDTO(savedBid), HttpStatus.CREATED);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<BidDTO>> getBidsByProduct(@PathVariable Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Produit non trouvé avec l'id: " + productId
                ));

        List<BidDTO> bids = bidRepository.findByProductOrderByAmountDesc(product)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(bids);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BidDTO>> getBidsByUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Utilisateur non trouvé avec l'id: " + userId
                ));

        // À implémenter dans BidRepository si besoin
        List<BidDTO> bids = bidRepository.findByUser(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(bids);
    }

    // Méthode utilitaire pour convertir Bid en BidDTO
    private BidDTO convertToDTO(Bid bid) {
        BidDTO dto = new BidDTO();
        dto.setId(bid.getId());
        dto.setAmount(bid.getAmount());
        dto.setCreatedAt(bid.getCreatedAt());

        // Convertir le bidder en UserSummaryDTO
        if (bid.getUser() != null) {
            UserSummaryDTO bidderDTO = new UserSummaryDTO();
            bidderDTO.setId(bid.getUser().getId());
            bidderDTO.setEmail(bid.getUser().getEmail());
            bidderDTO.setFirstName(bid.getUser().getFirstName());
            bidderDTO.setLastName(bid.getUser().getLastName());
            bidderDTO.setRole(bid.getUser().getRole());
            dto.setBidder(bidderDTO);
        }

        // Convertir le produit en ProductSummaryDTO
        if (bid.getProduct() != null) {
            ProductSummaryDTO productDTO = new ProductSummaryDTO();
            productDTO.setId(bid.getProduct().getId());
            productDTO.setName(bid.getProduct().getName());
            productDTO.setCurrentPrice(bid.getProduct().getCurrentPrice());
            productDTO.setEndTime(bid.getProduct().getEndTime());
            dto.setProduct(productDTO);
        }

        return dto;
    }
}