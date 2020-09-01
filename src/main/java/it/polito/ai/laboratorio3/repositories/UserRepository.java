package it.polito.ai.laboratorio3.repositories;

import it.polito.ai.laboratorio3.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
}
