package it.polito.ai.laboratorio3.entities;

import lombok.Data;

import javax.persistence.*;
import javax.print.Doc;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Course {
    @Id
    private String name;
    private int min;
    private int max;
    private boolean enabled;

    @ManyToMany(mappedBy = "courses")
    private List<Student> students = new ArrayList<>();

    @ManyToMany(mappedBy = "courses")
    private List<Docente> docenti = new ArrayList<>();

    @OneToMany(mappedBy = "course")
    private List<Team> teams = new ArrayList<>();

    //Progetto
    @OneToMany(mappedBy = "course")
    private List<Task> tasks = new ArrayList<>();

    public void addStudent(Student student){
        students.add(student);
        student.getCourses().add(this);
    }

    public void addDocente (Docente docente){
        docenti.add(docente);
        docente.getCourses().add(this);
    }

    public void addTeam(Team team){
        team.setCourse(this);
    }
}
