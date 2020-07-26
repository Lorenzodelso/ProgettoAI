package it.polito.ai.laboratorio3.controllers;

import it.polito.ai.laboratorio3.entities.User;
import it.polito.ai.laboratorio3.security.JwtTokenProvider;
import it.polito.ai.laboratorio3.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.ResponseEntity.ok;


@Controller
@RequestMapping("/API/notification")
public class NotificationController {
    @Autowired
    NotificationService notificationService;
    @Autowired
    JwtTokenProvider jwtTokenProvider;

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

    @GetMapping("confirmRegistration/{token}")
    public ResponseEntity acceptRegistration(@PathVariable String token){
        User userDetails = (User) notificationService.confirmRegistration(token);
        String jwt = jwtTokenProvider.createToken(userDetails.getUsername(),userDetails.getRoles());
        Map<Object, Object> model = new HashMap<>();
        model.put("username", userDetails.getUsername());
        model.put("token", jwt);
        return ok(model);
    }
}
