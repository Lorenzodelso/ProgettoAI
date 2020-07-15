package it.polito.ai.laboratorio3.repositories;

import it.polito.ai.laboratorio3.entities.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Timestamp;
import java.util.List;


public interface TokenRepository extends JpaRepository<Token,String> {
    @Query("SELECT token FROM Token token WHERE token.expiryDate >: t")
    List<Token> findAllByExpiryBefore(Timestamp t);

    @Query("SELECT token FROM Token token WHERE token.teamId=:teamId")
    List<Token>findAllByTeamId(Long teamId);
}
