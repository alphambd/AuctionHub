package com.auction.auction_engine;

import com.auction.auction_engine.entities.User;
import com.auction.auction_engine.entities.Product;
import com.auction.auction_engine.entities.Bid;
import com.auction.auction_engine.repositories.UserRepository;
import com.auction.auction_engine.repositories.ProductRepository;
import com.auction.auction_engine.repositories.BidRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.time.LocalDateTime;

@SpringBootApplication
public class AuctionEngineApplication {

		public static void main(String[] args) {
			SpringApplication.run(AuctionEngineApplication.class, args);
		}

		@Bean
		public CommandLineRunner testDatabase(
				UserRepository userRepository,
				ProductRepository productRepository) {
			return args -> {
				System.out.println("=== TEST DE LA BASE DE DONNÉES ===");

				// 1. Vérifier si l'utilisateur existe déjà
				User seller = userRepository.findByEmail("seller@test.com").orElse(null);

				if (seller == null) {
					// L'utilisateur n'existe pas, on le crée
					seller = new User();
					seller.setEmail("seller@test.com");
					seller.setPassword("password123");
					seller.setFirstName("Jean");
					seller.setLastName("Dupont");
					seller.setRole("SELLER");
					seller.setCreatedAt(LocalDateTime.now());

					seller = userRepository.save(seller);
					System.out.println("- Nouvel utilisateur créé : " + seller.getEmail());
				} else {
					System.out.println("- Utilisateur existant trouvé : " + seller.getEmail());
				}

				// 2. Vérifier si on a déjà des produits
				if (productRepository.count() == 0) {
					// Créer un produit de test
					Product product = new Product();
					product.setName("iPhone 13");
					product.setDescription("Comme neuf, état impeccable");
					product.setStartingPrice(500.0);
					product.setEndTime(LocalDateTime.now().plusDays(3));
					product.setSeller(seller);

					Product savedProduct = productRepository.save(product);
					System.out.println("- Produit de test créé : " + savedProduct.getName());
				} else {
					System.out.println("- Des produits existent déjà en base");
				}

				// 3. Afficher des statistiques
				System.out.println("+ Statistiques :");
				System.out.println("   - Nombre d'utilisateurs : " + userRepository.count());
				System.out.println("   - Nombre de produits actifs : " + productRepository.findByActiveTrue().size());

				System.out.println("=== TEST TERMINÉ AVEC SUCCÈS ===");
			};
		}
	}

