package it.polito.ai.laboratorio3.controllers;

import it.polito.ai.laboratorio3.dtos.CourseDTO;
import it.polito.ai.laboratorio3.dtos.StudentDTO;
import it.polito.ai.laboratorio3.dtos.TeamDTO;
import it.polito.ai.laboratorio3.exceptions.CourseNotFoundException;
import it.polito.ai.laboratorio3.exceptions.DocenteHasNotPrivilegeException;
import it.polito.ai.laboratorio3.services.NotificationService;
import it.polito.ai.laboratorio3.exceptions.StudentNotFoundException;
import it.polito.ai.laboratorio3.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;


import static it.polito.ai.laboratorio3.controllers.ModelHelper.enrich;

@RestController
@RequestMapping("/API/courses")
public class CourseController {
    @Autowired
    TeamService teamService;

    @Autowired
    NotificationService notificationService;

    @GetMapping({"","/"})
    public List<CourseDTO> all(){
        List<CourseDTO> courses = teamService.getAllCourses();
        courses.forEach(ModelHelper::enrich);
        return courses;
    }

    @GetMapping("/{name}")
    public CourseDTO getOne(@PathVariable String name){
        Optional<CourseDTO> courseDTO = teamService.getCourse(name);
        if (courseDTO.isPresent())
            return enrich(courseDTO.get());
        else
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,name);
    }

    @GetMapping("/{name}/enrolled")
    public List<StudentDTO> enrolledStudents(@PathVariable String name){
        if(teamService.getCourse(name).isPresent())
            return teamService.getEnrolledStudents(name);
        else throw new ResponseStatusException(HttpStatus.NOT_FOUND,name);
    }

    @PostMapping({"","/"})
    public CourseDTO addCourse(@RequestBody CourseDTO courseDTO, @AuthenticationPrincipal UserDetails userDetails, @RequestBody Map<String,Object> data){

        List<String> ids = new ArrayList<>();

        if(data.containsKey("docids"))
            ids = (List<String>) data.get("docids");

        if(!ids.contains( userDetails.getUsername()))
            ids.add(userDetails.getUsername());

        if(teamService.addCourse(courseDTO, ids))
            return enrich(courseDTO);
        else throw new ResponseStatusException(HttpStatus.CONFLICT,courseDTO.getName());
    }

    @PostMapping({"/{name}/enrollOne"})
    public StudentDTO enrollOne(@PathVariable String courseName,@RequestBody StudentDTO studentDTO){
        try{
            teamService.addStudentToCourse(studentDTO.getId(),courseName);
            return enrich(studentDTO);
        }catch (CourseNotFoundException courseExc){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,courseName);
        }catch (StudentNotFoundException studentExc){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,studentDTO.getId());
        }
    }

   @PostMapping("/{name}/enrollMany")
    public List<Boolean> enrollMany(@PathVariable String name, @RequestParam("file") MultipartFile file){
        String contentType = file.getContentType();
        if(!contentType.equals("text/csv"))
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE,file.getContentType());
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            return teamService.addAndEroll(reader,name);
        }catch (IOException exc){
            return new ArrayList<>();
        }
    }

    @PostMapping("/{name}/proposeTeam")
    public TeamDTO proposeTeam(@PathVariable String name, @RequestParam("team") String team, @RequestParam("membersIds") List<String> membersIds){
        TeamDTO teamDTO = teamService.proposeTeam(name,team,membersIds);
        notificationService.notifyTeam(teamDTO,membersIds);
        return teamDTO;
    }

    @GetMapping("/{name}/enableCourse")
    public CourseDTO enableCourse(@PathVariable String name){
        teamService.enableCourse(name);
        Optional<CourseDTO> courseDTO = teamService.getCourse(name);
        return enrich(courseDTO.get());
    }

    @GetMapping("/{name}/disableCourse")
    public CourseDTO disableCourse(@PathVariable String name){
        teamService.disableCourse(name);
        Optional<CourseDTO> courseDTO = teamService.getCourse(name);
        return enrich(courseDTO.get());
    }

    @GetMapping("/{name}/teams")
    public List<TeamDTO> getTeamsForCourse(@PathVariable String name){
        List<TeamDTO> teamDTOS = teamService.getTeamForCourse(name);
        return teamDTOS;
    }

    @GetMapping("/{name}/availableStudents")
    public List<StudentDTO> getAvailableStudents(@PathVariable String name){
        List<StudentDTO> studentDTOS = teamService.getAvailableStudents(name);
        studentDTOS.forEach(ModelHelper::enrich);
        return studentDTOS;
    }

    @GetMapping("/{name}/alreadyInTeamStudents")
    public List<StudentDTO> getAlreadyInTeamStudents(@PathVariable String name){
        List<StudentDTO> studentDTOS = teamService.getStudentsInTeams(name);
        studentDTOS.forEach(ModelHelper::enrich);
        return studentDTOS;
    }

    @DeleteMapping("/{name}")
    public void deleteCourse(@PathVariable String name, @AuthenticationPrincipal UserDetails userDetails){
       try{
           teamService.deleteCourse(name, userDetails.getUsername());
       }
       catch (CourseNotFoundException e){
           throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
       }
       catch (DocenteHasNotPrivilegeException e){
           throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
       }
    }
}
