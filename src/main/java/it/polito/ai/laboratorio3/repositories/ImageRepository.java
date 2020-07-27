package it.polito.ai.laboratorio3.repositories;

import it.polito.ai.laboratorio3.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image,Long> {
}
