package com.auction.auction_engine.services;

import com.auction.auction_engine.dto.BidMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Envoie une mise à jour d'enchère à tous les clients connectés
     * @param productId L'ID du produit concerné
     * @param newPrice Le nouveau prix
     * @param bidderName Le nom de l'enchérisseur
     */
    public void broadcastBidUpdate(Long productId, Double newPrice, String bidderName) {
        BidMessage message = new BidMessage(productId, newPrice, bidderName);

        // Envoie à tous les clients abonnés à /topic/product/{productId}
        messagingTemplate.convertAndSend("/topic/product/" + productId, message);

        // Optionnel : envoie aussi à un topic général pour les notifications
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }
}