package it.polito.ai.laboratorio3.repositories;

import it.polito.ai.laboratorio3.entities.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team,Long> {
}
