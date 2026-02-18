package com.auction.auction_engine.repositories;

import com.auction.auction_engine.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Spring va automatiquement implémenter cette méthode
    // qui générera : SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
}
