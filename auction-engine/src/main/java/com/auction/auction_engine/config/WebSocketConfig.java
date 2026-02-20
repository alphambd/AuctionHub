package com.auction.auction_engine.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Préfixe pour les messages envoyés aux clients (broadcast)
        config.enableSimpleBroker("/topic");

        // Préfixe pour les messages envoyés au serveur (si on avait besoin)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Point de connexion WebSocket pour les clients
        registry.addEndpoint("/ws")
                //.setAllowedOrigins("http://localhost:4200") // URL du frontend Angular

                // Ajout de plusieurs URL pour le tests temporaires
                .setAllowedOrigins(
                        "http://localhost:4200",  // Angular
                        "http://localhost:3000",  // Serveur Python
                        "http://localhost:5500",  // Live Server VS Code
                        "http://127.0.0.1:3000"   // Alternative pour localhost
                )

                .withSockJS(); // Fallback pour les navigateurs qui ne supportent pas WebSocket
    }
}