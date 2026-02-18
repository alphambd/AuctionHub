package com.auction.auction_engine.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class BidRequest {

    @NotNull(message = "Le montant est requis")
    @Positive(message = "Le montant doit être positif")
    private Double amount;

    @NotNull(message = "L'ID du produit est requis")
    private Long productId;

    @NotNull(message = "L'ID de l'utilisateur est requis")
    private Long userId; // Temporaire, sera remplacé par JWT plus tard

    // Getters et setters
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}