package it.polito.ai.laboratorio3;

import it.polito.ai.laboratorio3.entities.User;
import it.polito.ai.laboratorio3.repositories.UserRepository;
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
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        this.users.save(User.builder()
                .username("Lorenzo")
                .password(this.passwordEncoder.encode("loripsw"))
                .roles(Arrays.asList("ROLE_STUDENT"))
                .build()
        );

        this.users.save(User.builder()
                .username("Malnati")
                .password(this.passwordEncoder.encode("malnatipsw"))
                .roles(Arrays.asList("ROLE_PROFESSOR"))
                .build()
        );

        log.debug("printing all users...");
        this.users.findAll().forEach(v -> log.debug(" User :" + v.toString()));
    }
}
