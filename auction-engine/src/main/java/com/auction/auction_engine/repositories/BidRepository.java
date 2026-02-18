package com.auction.auction_engine.repositories;

import com.auction.auction_engine.entities.Bid;
import com.auction.auction_engine.entities.Product;
import com.auction.auction_engine.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    // Trouver toutes les enchères pour un produit
    List<Bid> findByProductOrderByAmountDesc(Product product);

    // Trouver l'enchère la plus élevée pour un produit
    Bid findFirstByProductOrderByAmountDesc(Product product);

    // Trouver un Bid par user
    List<Bid> findByUser(User user);
}
