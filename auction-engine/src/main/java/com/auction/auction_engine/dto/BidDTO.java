package com.auction.auction_engine.dto;

import java.time.LocalDateTime;

public class BidDTO {
    private Long id;
    private Double amount;
    private LocalDateTime createdAt;
    private UserSummaryDTO bidder;      // Qui a fait l'enchère
    private ProductSummaryDTO product;   // Produit concerné (version simplifiée)

    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public UserSummaryDTO getBidder() { return bidder; }
    public void setBidder(UserSummaryDTO bidder) { this.bidder = bidder; }

    public ProductSummaryDTO getProduct() { return product; }
    public void setProduct(ProductSummaryDTO product) { this.product = product; }
}