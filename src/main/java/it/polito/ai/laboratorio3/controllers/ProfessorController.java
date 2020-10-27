package it.polito.ai.laboratorio3.controllers;

import it.polito.ai.laboratorio3.dtos.CourseDTO;
import it.polito.ai.laboratorio3.dtos.ProfessorDTO;
import it.polito.ai.laboratorio3.dtos.StudentDTO;
import it.polito.ai.laboratorio3.exceptions.DocenteNotFoundException;
import it.polito.ai.laboratorio3.exceptions.StudentNotFoundException;
import it.polito.ai.laboratorio3.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

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

    @PutMapping({"/{professorId}"})
    public ProfessorDTO uploadImageForProfessor(@RequestBody MultipartFile imageFile, @PathVariable String professorId, @AuthenticationPrincipal UserDetails userDetails){
        try {
            if (!professorId.equals(userDetails.getUsername())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Non hai i privilegi!");
            } else {
                return teamService.uploadImageIntoProfessor(imageFile, professorId);
            }
        }catch (DocenteNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/{teacherId}")
    public List<CourseDTO> getCoursesByTeacherId(@PathVariable String teacherId) {
        System.out.println("WEWE");
        List<CourseDTO> courses = teamService.getCoursesByProf(teacherId);
        courses.forEach(ModelHelper::enrich);
        return courses;
    }

}
