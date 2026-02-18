package com.auction.auction_engine.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Double startingPrice;

    private Double currentPrice;

    @Column(nullable = false)
    private LocalDateTime endTime; // Date de fin des enchères

    private String imageUrl;

    private boolean active = true; // Enchères actives ou terminées

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Bid> bids = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (currentPrice == null) {
            currentPrice = startingPrice;
        }
    }
}
