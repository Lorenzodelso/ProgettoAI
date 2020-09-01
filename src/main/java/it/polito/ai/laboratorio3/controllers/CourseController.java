package it.polito.ai.laboratorio3.controllers;

import it.polito.ai.laboratorio3.dtos.*;
import it.polito.ai.laboratorio3.exceptions.*;
import it.polito.ai.laboratorio3.services.NotificationService;
import it.polito.ai.laboratorio3.services.TeamService;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.task.DelegatingSecurityContextAsyncTaskExecutor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.Lob;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.Principal;
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

    @GetMapping({"", "/"})
    public List<CourseDTO> all() {
        List<CourseDTO> courses = teamService.getAllCourses();
        courses.forEach(ModelHelper::enrich);
        return courses;
    }

    @GetMapping("/{name}")
    public CourseDTO getOne(@PathVariable String name) {
        Optional<CourseDTO> courseDTO = teamService.getCourse(name);
        if (courseDTO.isPresent())
            return enrich(courseDTO.get());
        else
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, name);
    }

    @GetMapping("/{name}/enrolled")
    public List<StudentDTO> enrolledStudents(@PathVariable String name) {
        if (teamService.getCourse(name).isPresent())
            return teamService.getEnrolledStudents(name);
        else throw new ResponseStatusException(HttpStatus.NOT_FOUND, name);
    }

    @PostMapping({"", "/"})
    public CourseDTO addCourse(@RequestParam("dto") CourseDTO courseDTO, @AuthenticationPrincipal UserDetails userDetails, @RequestParam("ids") List<String> ids) {

        if (!ids.contains(userDetails.getUsername()))
            ids.add(userDetails.getUsername());
            System.out.println(userDetails.getUsername());
        if (teamService.addCourse(courseDTO, ids))
            return enrich(courseDTO);
        else throw new ResponseStatusException(HttpStatus.CONFLICT, courseDTO.getName());
    }

    @PostMapping({"/{name}/enrollOne"})
    public StudentDTO enrollOne(@PathVariable String courseName, @RequestBody StudentDTO studentDTO) {
        try {
            teamService.addStudentToCourse(studentDTO.getId(), courseName);
            return enrich(studentDTO);
        } catch (CourseNotFoundException courseExc) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, courseName);
        } catch (StudentNotFoundException studentExc) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, studentDTO.getId());
        }
    }

    @PostMapping("/{name}/enrollMany")
    public List<Boolean> enrollMany(@PathVariable String name, @RequestParam("file") MultipartFile file) {
        String contentType = file.getContentType();
        if (!contentType.equals("text/csv"))
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, file.getContentType());
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            return teamService.addAndEroll(reader, name);
        } catch (IOException exc) {
            return new ArrayList<>();
        }
    }

    @PostMapping("/{name}/proposeTeam")
    public TeamDTO proposeTeam(@PathVariable String name, @RequestParam("team") String team, @RequestParam("membersIds") List<String> membersIds) {
        TeamDTO teamDTO = teamService.proposeTeam(name, team, membersIds);
        notificationService.notifyTeam(teamDTO, membersIds);
        return teamDTO;
    }

    @GetMapping("/{name}/enableCourse")
    public CourseDTO enableCourse(@PathVariable String name) {
        teamService.enableCourse(name);
        Optional<CourseDTO> courseDTO = teamService.getCourse(name);
        return enrich(courseDTO.get());
    }

    @GetMapping("/{name}/disableCourse")
    public CourseDTO disableCourse(@PathVariable String name) {
        teamService.disableCourse(name);
        Optional<CourseDTO> courseDTO = teamService.getCourse(name);
        return enrich(courseDTO.get());
    }

    @GetMapping("/{name}/teams")
    public List<TeamDTO> getTeamsForCourse(@PathVariable String name) {
        List<TeamDTO> teamDTOS = teamService.getTeamForCourse(name);
        return teamDTOS;
    }

    @GetMapping("/{name}/availableStudents")
    public List<StudentDTO> getAvailableStudents(@PathVariable String name) {
        List<StudentDTO> studentDTOS = teamService.getAvailableStudents(name);
        studentDTOS.forEach(ModelHelper::enrich);
        return studentDTOS;
    }

    @GetMapping("/{name}/alreadyInTeamStudents")
    public List<StudentDTO> getAlreadyInTeamStudents(@PathVariable String name) {
        List<StudentDTO> studentDTOS = teamService.getStudentsInTeams(name);
        studentDTOS.forEach(ModelHelper::enrich);
        return studentDTOS;
    }

    @DeleteMapping("/{name}")
    public void deleteCourse(@PathVariable String name, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            teamService.deleteCourse(name, userDetails.getUsername());
        } catch (CourseNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (DocenteHasNotPrivilegeException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @PutMapping("/{name}")
    public CourseDTO updateCourse(@PathVariable String name, @RequestBody CourseDTO dto, @RequestBody Map<String, Object> data, @AuthenticationPrincipal UserDetails userDetails) {

        List<String> ids = new ArrayList<>();

        if (data.containsKey("docids"))
            ids = (List<String>) data.get("docids");

        if (!ids.contains(userDetails.getUsername()))
            ids.add(userDetails.getUsername());

        try {
            return teamService.updateCourse(name, dto, ids);
        } catch (CourseNotFoundException | DocenteNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (DocenteHasNotPrivilegeException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @PutMapping("/{name}/unsubscribeOne/{studentId}")
    public void updateCourseStudent(@PathVariable String name, @PathVariable String studentId, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            teamService.unsubscribeOne(name, studentId, userDetails.getUsername());
        } catch (CourseNotFoundException | StudentNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (DocenteHasNotPrivilegeException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }

    }

    @PutMapping("/{name}/unsubscribeMany")
    public void updateCourseStudents(@PathVariable String name, @RequestBody Map<String, Object> data, @AuthenticationPrincipal UserDetails userDetails) {

        if (!data.containsKey("ids"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "request must contain filed ids with the ids of the students");

        List<String> ids = (List<String>) data.get("ids");
        try {
            teamService.unsubscribeMany(name, ids, userDetails.getUsername());
        } catch (CourseNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (DocenteHasNotPrivilegeException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }

    }

    @GetMapping("/{name}/teams/{teamId}/vms")
    public List<VmDTO> getVmsFromTeam(@PathVariable String name, @PathVariable String teamId, @AuthenticationPrincipal UserDetails userDetails) {

        try {
            return teamService.getVmsByTeam(name, Long.valueOf(teamId), userDetails.getUsername());
        } catch (TeamNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }


    @PutMapping("/{name}/teams/{teamId}")
    public void changeVmsLimit(@PathVariable String name, @PathVariable String teamId, @AuthenticationPrincipal UserDetails userDetails, @RequestBody Map<String, Integer> data) {
        int vcpus, GBram, GBdisk;
        vcpus = data.getOrDefault("vcpus", -1);
        GBram = data.getOrDefault("gbram", -1);
        GBdisk = data.getOrDefault("gbdisk", -1);

        try {
            teamService.changeVmsLimit(name, Long.valueOf(teamId), userDetails.getUsername(), vcpus, GBram, GBdisk);
        } catch (TeamNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (TooManyResourcesUsedException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/{name}/tasks")
    public List<TaskDTO> getTasks(@PathVariable String name) {
        try {
            return teamService.getTasks(name);
        } catch (CourseNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/{name}/tasks/{taskId}")
    public TaskDTO getTask(@PathVariable String name, @PathVariable String taskId, @AuthenticationPrincipal UserDetails userDetails){
        try{
            return teamService.getTask(name,Long.valueOf(taskId),userDetails);
        }catch (TaskNotFoundException | StudentNotFoundException | CourseNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,e.getMessage());
        }
    }

    @PostMapping("/{name}/task")
    public TaskDTO createTask(@PathVariable String name, @AuthenticationPrincipal UserDetails userDetails, @RequestBody Map<String, Integer> data, @RequestBody MultipartFile taskImg) {
        if (!data.containsKey("days"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insert filed days, duration of task");
        int days = data.get("days");
        if (days < 1)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duration must be at least one day");
        try {
            return teamService.createTask(name, userDetails.getUsername(), days, taskImg.getBytes());
        } catch (IOException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Errore caricamento file");
        }
        catch (CourseNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (DocenteHasNotPrivilegeException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @GetMapping("/{name}/tasks/{taskId}/essays")
    //TODO controllare se funziona anche senza parametro name
    public List<EssayDTO> getEssays(@PathVariable String taskId, @PathVariable String name){
        try{
            return teamService.getEssays(Long.valueOf(taskId));
        }catch (TaskNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,e.getMessage());
        }
    }

    @GetMapping("/{name}/tasks/{taskId}/essays/{essayId}")
    public EssayDTO getEssay(@PathVariable String taskId, @PathVariable String name, @PathVariable String essayId,@AuthenticationPrincipal UserDetails userDetails){
        try{
            return teamService.getEssay(Long.valueOf(taskId),Long.valueOf(essayId),userDetails);
        } catch (EssayNotFoundException | TaskNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,e.getMessage());
        }
    }

    @GetMapping("/{name}/tasks/{taskId}/essays/{essayId}/storical")
    public List<ImageDTO> getEssayStorical(@PathVariable String taskId, @PathVariable String name, @PathVariable String essayId) {
        try {
            return teamService.getStorical(name, Long.valueOf(taskId), Long.valueOf(essayId));
        } catch (EssayNotFoundException | TaskNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PutMapping("/{name}/tasks/{taskId}/essays/{essayId}")
    public EssayDTO loadEssay(@PathVariable String name, @PathVariable String taskId, @PathVariable String essayId,@RequestBody MultipartFile data, @AuthenticationPrincipal UserDetails userDetails, @RequestBody Map<String,String> option){
        Long voto;
        if(option.containsKey("voto"))
            voto = Long.valueOf(option.get("voto"));
        else
            voto = Long.valueOf("-1");
        if(voto.intValue() > 31)
            voto = Long.valueOf("31");
        if(voto.intValue() < 18)
            voto = Long.valueOf("17");
        try{
            return teamService.loadEssay(Long.valueOf(taskId),Long.valueOf(essayId), data.getBytes(), userDetails, voto);
        } catch (IOException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Errore caricamento file");
        }
        catch (EssayNotFoundException | TaskNotFoundException | EssayNotLoadedByStudentException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,e.getMessage());
        }
    }
}
