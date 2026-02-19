package com.auction.auction_engine.controllers;

import com.auction.auction_engine.dto.ProductDTO;
import com.auction.auction_engine.dto.UserSummaryDTO;
import com.auction.auction_engine.entities.Product;
import com.auction.auction_engine.entities.User;
import com.auction.auction_engine.repositories.ProductRepository;
import com.auction.auction_engine.repositories.UserRepository;
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
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<ProductDTO> getAllActiveProducts() {
        return productRepository.findByActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok(convertToDTO(product)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductRequest productRequest) {
        // Récupérer l'utilisateur connecté
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Vendeur non trouvé"
                ));

        // Vérifier que l'utilisateur a le rôle SELLER
        if (!"SELLER".equals(seller.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Seuls les vendeurs peuvent créer des produits"
            );
        }

        // Reste du code identique...
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setStartingPrice(productRequest.getStartingPrice());
        product.setCurrentPrice(productRequest.getStartingPrice());
        product.setEndTime(productRequest.getEndTime());
        product.setSeller(seller);
        product.setActive(true);

        Product savedProduct = productRepository.save(product);
        return new ResponseEntity<>(convertToDTO(savedProduct), HttpStatus.CREATED);
    }

    @GetMapping("/test/ping")
    public String ping() {
        return "pong";
    }

    // Méthode utilitaire pour convertir Product en ProductDTO
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setStartingPrice(product.getStartingPrice());
        dto.setCurrentPrice(product.getCurrentPrice());
        dto.setEndTime(product.getEndTime());
        dto.setImageUrl(product.getImageUrl());
        dto.setActive(product.isActive());

        // Convertir le seller en UserSummaryDTO (sans la liste products)
        if (product.getSeller() != null) {
            UserSummaryDTO sellerDTO = new UserSummaryDTO();
            sellerDTO.setId(product.getSeller().getId());
            sellerDTO.setEmail(product.getSeller().getEmail());
            sellerDTO.setFirstName(product.getSeller().getFirstName());
            sellerDTO.setLastName(product.getSeller().getLastName());
            sellerDTO.setRole(product.getSeller().getRole());
            dto.setSeller(sellerDTO);
        }

        return dto;
    }
}

// Classe pour recevoir les données du frontend
class ProductRequest {
    private String name;
    private String description;
    private Double startingPrice;
    private LocalDateTime endTime;

    // Getters et setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getStartingPrice() { return startingPrice; }
    public void setStartingPrice(Double startingPrice) { this.startingPrice = startingPrice; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

}