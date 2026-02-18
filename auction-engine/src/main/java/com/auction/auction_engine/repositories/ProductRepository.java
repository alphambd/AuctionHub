package com.auction.auction_engine.repositories;

import com.auction.auction_engine.entities.Product;
import com.auction.auction_engine.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Trouver tous les produits actifs
    List<Product> findByActiveTrue();

    // Trouver les produits d'un vendeur spécifique
    List<Product> findBySeller(User seller);

    // Trouver les produits actifs d'un vendeur
    List<Product> findBySellerAndActiveTrue(User seller);
}
