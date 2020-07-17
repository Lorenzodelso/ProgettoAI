package it.polito.ai.laboratorio3.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
@Data
public class Docente{

    @Id
    private String id;
    private String name;
    private String firstName;

    @ManyToMany(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    @JoinTable(name = "docente_course",joinColumns = @JoinColumn(name = "docente_id"),inverseJoinColumns = @JoinColumn(name = "course_name"))
    private List<Course> courses = new ArrayList<>();

    @OneToMany(mappedBy = "docente")
    List<Task> tasks = new ArrayList<>();

    public void addCourse(Course course){
        courses.add(course);
        course.getDocenti().add(this);
    }

}
