package it.polito.ai.laboratorio3;

import it.polito.ai.laboratorio3.dtos.ProfessorDTO;
import it.polito.ai.laboratorio3.dtos.StudentDTO;
import it.polito.ai.laboratorio3.entities.User;
import it.polito.ai.laboratorio3.repositories.UserRepository;
import it.polito.ai.laboratorio3.services.TeamService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository users;

    @Autowired
    TeamService teamService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if(!users.existsById("s263206")) {
            this.users.save(User.builder()
                    .username("s263206")
                    .password(this.passwordEncoder.encode("loripsw"))
                    .roles(Arrays.asList("ROLE_STUDENT"))
                    .build()
            );
            teamService.addStudent(new StudentDTO("s2632060","loreno", "delsordo") , new byte[]{0});
        }

        if(!users.existsById("d1")) {
            this.users.save(User.builder()
                    .username("d1")
                    .password(this.passwordEncoder.encode("malnatipsw"))
                    .roles(Arrays.asList("ROLE_PROFESSOR"))
                    .build()
            );

            teamService.addProfessor(new ProfessorDTO("d1","giovanni","malnati"));
        }

        if(!users.existsById("d2")) {
            this.users.save(User.builder()
                    .username("d2")
                    .password(this.passwordEncoder.encode("cabodipsw"))
                    .roles(Arrays.asList("ROLE_PROFESSOR"))
                    .build()
            );

            teamService.addProfessor(new ProfessorDTO("d2","gianpiero","cabodi"));
        }
        log.debug("printing all users...");
        this.users.findAll().forEach(v -> log.debug(" User :" + v.toString()));
    }
}
