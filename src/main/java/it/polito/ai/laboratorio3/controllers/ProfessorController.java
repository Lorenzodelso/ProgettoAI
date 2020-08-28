package it.polito.ai.laboratorio3.controllers;

import it.polito.ai.laboratorio3.dtos.ProfessorDTO;
import it.polito.ai.laboratorio3.dtos.StudentDTO;
import it.polito.ai.laboratorio3.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;



@RestController
@RequestMapping("API/professor")
public class ProfessorController {

    @Autowired
    TeamService teamService;

    @GetMapping({"","/"})
    public List<ProfessorDTO> getProfessor(){
        List<ProfessorDTO> prof = teamService.getAllProfessor();
        return prof;
    }
}
