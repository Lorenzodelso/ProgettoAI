package it.polito.ai.laboratorio3.controllers;

import it.polito.ai.laboratorio3.dtos.UserDTO;
import it.polito.ai.laboratorio3.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/register")
public class RegistrationController {
    @Autowired
    NotificationService notificationService;

    @PostMapping("")
    public void register(@RequestBody UserDTO userDTO){
        notificationService.notifyRegistration(userDTO);
    }
}
