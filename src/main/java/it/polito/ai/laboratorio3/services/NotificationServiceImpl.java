package it.polito.ai.laboratorio3.services;

import it.polito.ai.laboratorio3.dtos.TeamDTO;
import it.polito.ai.laboratorio3.entities.Token;
import it.polito.ai.laboratorio3.exceptions.TokenExpiredException;
import it.polito.ai.laboratorio3.exceptions.TokenNotFoundException;
import it.polito.ai.laboratorio3.repositories.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Component
public class NotificationServiceImpl implements NotificationService {
    @Bean
    public SimpleMailMessage templateSimpleMessage() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setText(
                "Confirm the partecipation at:\nhttp://localhost:8080/API/notification/confirm/%s\n" +
                        "Reject the partecipation at:\nhttp://localhost:8080/API/notification/reject/%s\n");
        return message;
    }

    @Autowired
    public JavaMailSender emailSender;

    @Autowired
    TokenRepository tokenRepository;

    @Autowired
    TeamService teamService;

    @Autowired
    SimpleMailMessage template;

    @Override
    public void sendMessage(String address, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(address);
        message.setSubject(subject);
        message.setText(body);
        emailSender.send(message);
    }

    @Override
    public boolean confirm(String token) {
        Optional<Token> tokenOptional = tokenRepository.findById(token);
        if(!tokenOptional.isPresent())
            throw new TokenNotFoundException();
        else{
            if (!tokenOptional.get().getExpiryDate().after(Timestamp.valueOf(LocalDateTime.now())))
                throw new TokenExpiredException();
        }
        tokenRepository.delete(tokenOptional.get());

        Long teamId = tokenOptional.get().getTeamId();
        List<Token> teamTokens = tokenRepository.findAllByTeamId(teamId);
        if(teamTokens.isEmpty()){
            teamService.activeTeam(teamId);
            return true;
        }
        return false;
    }

    @Override
    public boolean reject(String token) {
        Optional<Token> tokenOptional = tokenRepository.findById(token);
        if(!tokenOptional.isPresent())
            throw new TokenNotFoundException();
        else{
            if (!tokenOptional.get().getExpiryDate().after(Timestamp.valueOf(LocalDateTime.now())))
                throw new TokenExpiredException();
        }
        Long teamId = tokenOptional.get().getTeamId();
        List<Token> teamTokens = tokenRepository.findAllByTeamId(teamId);
        teamTokens.forEach(tk -> tokenRepository.delete(tk));
        teamService.evictTeam(teamId);
        return true;
    }

    @Override
    public void notifyTeam(TeamDTO dto, List<String> memberIds) {
        for (String s : memberIds) {
            String tokendId = UUID.randomUUID().toString();
            Long teamId = dto.getId();
            Timestamp expiryDate = Timestamp.valueOf(LocalDateTime.now().plusHours(1));
            Token token = new Token();
            token.setId(tokendId);
            token.setTeamId(teamId);
            token.setExpiryDate(expiryDate);

            tokenRepository.save(token);

            String bodyMessage = String.format(template.getText(),tokendId,tokendId);
            sendMessage("s265659@studenti.polito.it","Team confirmation",bodyMessage);
        }
    }
}
