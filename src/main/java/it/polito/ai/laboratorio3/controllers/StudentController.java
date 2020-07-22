package it.polito.ai.laboratorio3.controllers;

import it.polito.ai.laboratorio3.dtos.*;
import it.polito.ai.laboratorio3.exceptions.*;
import it.polito.ai.laboratorio3.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
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
    public StudentDTO addStudent(@RequestBody StudentDTO studentDTO, @RequestBody MultipartFile studentImg){
        try {
            if (teamService.addStudent(studentDTO, studentImg.getBytes()))
                return enrich(studentDTO);
            else throw new ResponseStatusException(HttpStatus.CONFLICT, studentDTO.getId());
        }catch (IOException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Errore caricamento immagine!");
        }
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

    @GetMapping("/{id}/teams/{teamid}/vms")
    public List<VmDTO> getVms (@PathVariable String id, @PathVariable String teamId){
        try {
            return teamService.getVmsByStudent(id, Long.valueOf(teamId));
        }
        catch (StudentNotFoundException | TeamNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,e.getMessage());
        }
    }

    @PostMapping("/{id}/teams/{teamid}/vm")
    public VmDTO createVm (@PathVariable String id, @PathVariable String teamId, @RequestBody VmDTO dto, @RequestBody MultipartFile screenVm){
        try {

            return teamService.createVm(id, Long.valueOf(teamId), dto, screenVm.getBytes());
        }
        catch (IOException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Errore caricamento Vm");
        }
        catch (StudentNotFoundException | TeamNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,e.getMessage());
        }
        catch (InsufficientResourcesException | StudentHasNotPrivilegeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,e.getMessage());
        }

    }

    @DeleteMapping("/{id}/teams/{teamid}/vms/{vmId}")
    public void deleteVm(@PathVariable String id, @PathVariable String teamId, @PathVariable String vmId){
        try {
            teamService.deleteVm(id, Long.valueOf(teamId), Long.valueOf(vmId));
        }
        catch (StudentNotFoundException | TeamNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,e.getMessage());
        }
        catch (StudentHasNotPrivilegeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,e.getMessage());
        }
    }

    @PutMapping("/{id}/teams/{teamid}/vms/{vmId}/switch")
    public void switchVm(@PathVariable String id, @PathVariable String teamId, @PathVariable String vmId){
        try {
            teamService.switchVm(id,Long.valueOf(teamId),Long.valueOf(vmId));
        }
        catch (StudentNotFoundException | TeamNotFoundException | VmNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,e.getMessage());
        }
    }

}
