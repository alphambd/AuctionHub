package com.auction.auction_engine.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class BidRequest {
    private Double amount;
    private Long productId;

    // On supprime complètement le champ userId car on le récupère du token !

    // Getters et setters
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
}