package it.polito.ai.laboratorio3.controllers;

import it.polito.ai.laboratorio3.dtos.*;
import it.polito.ai.laboratorio3.exceptions.InsufficientResourcesException;
import it.polito.ai.laboratorio3.exceptions.StudentNotFoundException;
import it.polito.ai.laboratorio3.exceptions.TeamNotFoundException;
import it.polito.ai.laboratorio3.exceptions.VmNotFoundException;
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

    @GetMapping("/{id}/courses/{name}/requests")
    public List<TokenDTO> getRequests (@PathVariable String id, @PathVariable String name){
        List<TokenDTO> tokens = teamService.getRequestsForStudent(id, name);
        return tokens;
    }

    @GetMapping("/{id}/teams/{teamid}/vMs")
    public List<VmDTO> getVms (@PathVariable String id, @PathVariable String teamId){
        try {
            return teamService.getVmsByStudent(id, Long.valueOf(teamId));
        }
        catch (StudentNotFoundException | TeamNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,e.getMessage());
        }
    }

    @PostMapping("/{id}/teams/{teamid}/vM")
    public VmDTO createVm (@PathVariable String id, @PathVariable String teamId, @RequestBody VmDTO dto){
        try {
            return teamService.createVm(id, Long.valueOf(teamId), dto);
        }
        catch (StudentNotFoundException | TeamNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,e.getMessage());
        }
        catch (InsufficientResourcesException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,e.getMessage());
        }

    }

    @PutMapping("/{id}/teams/{teamid}/vMs/{vMId}/switch")
    public void switchVm(@PathVariable String id, @PathVariable String teamId, @PathVariable String vmId){
        try {
            teamService.switchVm(id,Long.valueOf(teamId),Long.valueOf(vmId));
        }
        catch (StudentNotFoundException | TeamNotFoundException | VmNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,e.getMessage());
        }
    }

}
