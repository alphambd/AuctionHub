package com.auction.auction_engine.dto;

import java.time.LocalDateTime;

public class BidMessage {
    private Long productId;
    private Double newPrice;
    private String bidderName;
    private LocalDateTime timestamp;
    private String message; // Optionnel : "Nouvelle enchère de 550€ par Marie"

    // Constructeur
    public BidMessage(Long productId, Double newPrice, String bidderName) {
        this.productId = productId;
        this.newPrice = newPrice;
        this.bidderName = bidderName;
        this.timestamp = LocalDateTime.now();
        this.message = String.format("Nouvelle enchère de %.2f€ par %s", newPrice, bidderName);
    }

    // Getters et setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Double getNewPrice() { return newPrice; }
    public void setNewPrice(Double newPrice) { this.newPrice = newPrice; }

    public String getBidderName() { return bidderName; }
    public void setBidderName(String bidderName) { this.bidderName = bidderName; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}