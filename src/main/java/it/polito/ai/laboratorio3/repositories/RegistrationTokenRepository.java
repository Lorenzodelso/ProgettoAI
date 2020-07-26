package it.polito.ai.laboratorio3.repositories;

import it.polito.ai.laboratorio3.entities.RegistrationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationTokenRepository extends JpaRepository<RegistrationToken,String> {
}
