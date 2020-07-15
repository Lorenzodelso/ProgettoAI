package it.polito.ai.laboratorio3.controllers;

import it.polito.ai.laboratorio3.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Controller
@RequestMapping("/API/notification")
public class NotificationController {
    @Autowired
    NotificationService notificationService;

    @GetMapping("/confirm/{token}")
    public String acceptRequest(@PathVariable String token){
        notificationService.confirm(token);
        return "tokenAcceptedTemplate.html";
    }

    @GetMapping("/reject/{token}")
    public String rejectRequest(@PathVariable String token){
        notificationService.reject(token);
        return "tokenRejectedTemplate.html";
    }
}
