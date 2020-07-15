package it.polito.ai.laboratorio3.controllers;

import it.polito.ai.laboratorio3.dtos.CourseDTO;
import it.polito.ai.laboratorio3.dtos.StudentDTO;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

public class ModelHelper {
    public static StudentDTO enrich(StudentDTO studentDTO){
        return studentDTO.add(linkTo(StudentController.class).slash(studentDTO.getId()).withSelfRel());
    }
    public static CourseDTO enrich(CourseDTO courseDTO){
        return courseDTO.add(linkTo(CourseController.class).slash(courseDTO.getName()).withSelfRel())
                .add(linkTo(CourseController.class).slash(courseDTO.getName()+"/enrolled").withRel("enrolled"));
    }


}
