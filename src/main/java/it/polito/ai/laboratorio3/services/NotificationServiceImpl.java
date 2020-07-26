package it.polito.ai.laboratorio3.services;

import it.polito.ai.laboratorio3.dtos.ProfessorDTO;
import it.polito.ai.laboratorio3.dtos.StudentDTO;
import it.polito.ai.laboratorio3.dtos.TeamDTO;
import it.polito.ai.laboratorio3.dtos.UserDTO;
import it.polito.ai.laboratorio3.entities.RegistrationToken;
import it.polito.ai.laboratorio3.entities.Student;
import it.polito.ai.laboratorio3.entities.Token;
import it.polito.ai.laboratorio3.entities.User;
import it.polito.ai.laboratorio3.exceptions.TokenExpiredException;
import it.polito.ai.laboratorio3.exceptions.TokenNotFoundException;
import it.polito.ai.laboratorio3.repositories.RegistrationTokenRepository;
import it.polito.ai.laboratorio3.repositories.StudentRepository;
import it.polito.ai.laboratorio3.repositories.TokenRepository;
import it.polito.ai.laboratorio3.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.sql.Array;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Component
public class NotificationServiceImpl implements NotificationService {
    @Bean("teamTemplateMessage")
    public SimpleMailMessage templateSimpleMessage() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setText(
                "Confirm the partecipation at:\nhttp://localhost:8080/API/notification/confirm/%s\n" +
                        "Reject the partecipation at:\nhttp://localhost:8080/API/notification/reject/%s\n");
        return message;
    }

    @Bean(name = "registrationTemplateMessage")
    public SimpleMailMessage registrationTemplateMessage(){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setText(
                "Confirm the registration at:\nhttp://localhost:8080/API/notification/confirmRegistration/%s\n"
        );
        return message;
    }

    @Autowired
    public JavaMailSender emailSender;

    @Autowired
    TokenRepository tokenRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    RegistrationTokenRepository registrationTokenRepository;

    @Autowired
    TeamService teamService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;


    @Qualifier("teamTemplateMessage")
    @Autowired
    SimpleMailMessage template;

    @Qualifier("registrationTemplateMessage")
    @Autowired
    SimpleMailMessage registrationTemplate;

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

        String courseName = teamService.getCourseNameByTeamId(dto.getId());

        for (String s : memberIds) {
            Optional<Student> studentOpt = studentRepository.findById(s);
            if (!studentOpt.isPresent())
                throw new RuntimeException();
            Student student = studentOpt.get();

            String tokendId = UUID.randomUUID().toString();
            Long teamId = dto.getId();
            Timestamp expiryDate = Timestamp.valueOf(LocalDateTime.now().plusHours(1));
            Token token = new Token();
            token.setId(tokendId);
            token.setTeamId(teamId);
            token.setExpiryDate(expiryDate);
            token.setCourseName(courseName);
            token.setStudent(student);


            tokenRepository.save(token);

            String bodyMessage = String.format(template.getText(),tokendId,tokendId);
            sendMessage("s265659@studenti.polito.it","Team confirmation",bodyMessage);
        }
    }

    @Override
    public void notifyRegistration(UserDTO userDTO) {
        String tokenId = UUID.randomUUID().toString();
        Timestamp expiryDate = Timestamp.valueOf(LocalDateTime.now().plusHours(1));
        RegistrationToken token = new RegistrationToken();
        token.setId(tokenId);
        token.setExpirationDate(expiryDate);
        token.setUserName(userDTO.getUsername());
        token.setUserSurname(userDTO.getUsername());
        token.setUserPassword(passwordEncoder.encode(userDTO.getPassword()));
        token.setUserEmail(userDTO.getEmail());
        token.setUserRole(userDTO.getRole());

        registrationTokenRepository.save(token);

        String bodyMessage = String.format(registrationTemplate.getText(),tokenId);
        sendMessage(userDTO.getEmail(),"Registration confirmation", bodyMessage);
    }

    @Override
    public UserDetails confirmRegistration(String token) {
        Optional<RegistrationToken> tokenOptional = registrationTokenRepository.findById(token);
        if(!tokenOptional.isPresent())
            throw new TokenNotFoundException();
        else{
            if (!tokenOptional.get().getExpirationDate().after(Timestamp.valueOf(LocalDateTime.now())))
                throw new TokenExpiredException();
        }
        RegistrationToken registrationToken = tokenOptional.get();
        registrationTokenRepository.delete(registrationToken);
        User user = User.builder()
                .username(registrationToken.getUserName())
                .password(registrationToken.getUserPassword())
                .roles(Arrays.asList(registrationToken.getUserRole()))
                .build();
        userRepository.save(user);
        if(registrationToken.getUserRole().equals("ROLE_STUDENT")){
            StudentDTO studentDTO = new StudentDTO();
            studentDTO.setName(registrationToken.getUserName());
            studentDTO.setFirstName(registrationToken.getUserSurname());
            //TODO: generazione dell'id dello studente per ora fatto con UUID
            studentDTO.setId(UUID.fromString(registrationToken.getUserName()).toString());
            teamService.addStudent(studentDTO,new byte[0]);
        }else{
            if(registrationToken.getUserRole().equals("ROLE_PROFESSOR")){
                ProfessorDTO professorDTO = new ProfessorDTO();
                professorDTO.setName(registrationToken.getUserName());
                professorDTO.setFirstName(registrationToken.getUserSurname());
                professorDTO.setId(UUID.fromString(registrationToken.getUserName()).toString());
                teamService.addProfessor(professorDTO);
            }
        }
        return user;
    }
}
