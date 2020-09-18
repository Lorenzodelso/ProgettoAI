package it.polito.ai.laboratorio3.controllers;

import it.polito.ai.laboratorio3.dtos.CourseDTO;
import it.polito.ai.laboratorio3.dtos.EssayDTO;
import it.polito.ai.laboratorio3.dtos.StudentDTO;
import it.polito.ai.laboratorio3.dtos.TeamDTO;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

public class ModelHelper {
    public static StudentDTO enrich(StudentDTO studentDTO){
        return studentDTO.add(linkTo(StudentController.class).slash(studentDTO.getId()).withSelfRel())
                .add(linkTo(StudentController.class).slash(studentDTO.getId()+"/courses").withRel("courses"))
                .add(linkTo(StudentController.class).slash(studentDTO.getId()+"/teams").withRel("teams"))
                .add(linkTo(StudentController.class).slash(studentDTO.getId()+"/image").withRel("image"));
    }

    public static CourseDTO enrich(CourseDTO courseDTO){
        return courseDTO.add(linkTo(CourseController.class).slash(courseDTO.getName()).withSelfRel())
                .add(linkTo(CourseController.class).slash(courseDTO.getName()+"/enrolled").withRel("enrolled"))
                .add(linkTo(CourseController.class).slash(courseDTO.getName()+"/teams").withRel("teams"))
                .add(linkTo(CourseController.class).slash(courseDTO.getName()+"/availableStudents").withRel("availableStudents"))
                .add(linkTo(CourseController.class).slash(courseDTO.getName()+"/alreadyInTeamStudents").withRel("alreadyInTeamStudents"))
                .add(linkTo(CourseController.class).slash(courseDTO.getName()+"/tasks").withRel("tasks"));
    }



}
