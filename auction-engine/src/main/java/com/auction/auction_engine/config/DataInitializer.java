package com.auction.auction_engine.config;

import com.auction.auction_engine.entities.Product;
import com.auction.auction_engine.entities.User;
import com.auction.auction_engine.repositories.ProductRepository;
import com.auction.auction_engine.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== INITIALISATION DES DONNÉES DE TEST ===");

        if (userRepository.count() == 0) {
            createUsers();
            createProducts();
        } else {
            System.out.println("ℹ️ Des données existent déjà, aucune initialisation nécessaire");
        }

        System.out.println("=== FIN DE L'INITIALISATION ===");
    }

    private void createUsers() {
        User seller = new User();
        seller.setEmail("vendeur@test.com");
        seller.setPassword(passwordEncoder.encode("password123"));
        seller.setFirstName("Pierre");
        seller.setLastName("Martin");
        seller.setRole("SELLER");
        seller.setCreatedAt(LocalDateTime.now());
        userRepository.save(seller);
        System.out.println("✅ Vendeur créé: Pierre Martin");

        User buyer = new User();
        buyer.setEmail("acheteur@test.com");
        buyer.setPassword(passwordEncoder.encode("password123"));
        buyer.setFirstName("Marie");
        buyer.setLastName("Dubois");
        buyer.setRole("BUYER");
        buyer.setCreatedAt(LocalDateTime.now());
        userRepository.save(buyer);
        System.out.println("✅ Acheteur créé: Marie Dubois");
    }

    private void createProducts() {
        User seller = userRepository.findByEmail("vendeur@test.com").orElseThrow();

        Product[] products = {
                createProduct("iPhone 13 Pro", "Smartphone Apple, 256GB, état neuf", 500.0, 3, seller, 1),
                createProduct("MacBook Pro 14", "Apple M2, 16GB RAM, 512GB SSD", 1200.0, 5, seller, 2),
                createProduct("PlayStation 5", "Console de jeux, édition standard, 2 manettes", 300.0, 2, seller, 3),
                createProduct("Apple Watch Series 8", "Montre connectée, GPS, 45mm", 150.0, 4, seller, 4)
        };

        productRepository.saveAll(Arrays.asList(products));
        System.out.println("✅ 4 produits de test créés");
    }

    private Product createProduct(String name, String desc, double price, int days, User seller, int random) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setStartingPrice(price);
        p.setCurrentPrice(price);
        p.setEndTime(LocalDateTime.now().plusDays(days));
        p.setActive(true);
        p.setSeller(seller);
        p.setImageUrl("https://picsum.photos/200/300?random=" + random);
        return p;
    }
}