package it.polito.ai.laboratorio3.controllers;

import it.polito.ai.laboratorio3.dtos.UserDTO;
import it.polito.ai.laboratorio3.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
public class RegistrationController {
    @Autowired
    NotificationService notificationService;

    @PostMapping("")
    public void register(@RequestBody UserDTO userDTO){

        String[] check = userDTO.getEmail().split("@");
        if(check[1].startsWith("studenti.polito.it") ||check[1].startsWith("polito.it") )
        notificationService.notifyRegistration(userDTO);
    }
}
