package it.polito.ai.laboratorio3.repositories;

import it.polito.ai.laboratorio3.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {
}
