package it.polito.ai.laboratorio3.controllers;

import it.polito.ai.laboratorio3.dtos.CourseDTO;
import it.polito.ai.laboratorio3.dtos.StudentDTO;
import it.polito.ai.laboratorio3.dtos.TeamDTO;
import it.polito.ai.laboratorio3.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static it.polito.ai.laboratorio3.controllers.ModelHelper.enrich;

@RestController
@RequestMapping("/API/students")
public class StudentController {
    @Autowired
    TeamService teamService;

    @GetMapping({"","/"})
    public List<StudentDTO> all(){
        List<StudentDTO> students = teamService.getAllStudents();
        students.forEach(ModelHelper::enrich);
        return students;
    }

    @GetMapping("/{studentId}")
    public StudentDTO getStudent(@PathVariable String studentId){
        Optional<StudentDTO> studentDTO = teamService.getStudent(studentId);
        if(studentDTO.isPresent())
            return enrich(studentDTO.get());
        else
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,studentId);
    }

    @PostMapping({"","/"})
    public StudentDTO addStudent(@RequestBody StudentDTO studentDTO){
        if(teamService.addStudent(studentDTO))
            return enrich(studentDTO);
        else throw new ResponseStatusException(HttpStatus.CONFLICT,studentDTO.getId());
    }

    @GetMapping("/{id}/courses")
    public List<CourseDTO> getCoursesForStudent(@PathVariable String id){
        List<CourseDTO> courseDTOS = teamService.getCourses(id);
        courseDTOS.forEach(ModelHelper::enrich);
        return courseDTOS;
    }

    @GetMapping("/{id}/teams")
    public List<TeamDTO> getTeamsForStudent(@PathVariable String id){
        List<TeamDTO> teamDTOS = teamService.getTeamsForStudent(id);
        return teamDTOS;
    }


}
