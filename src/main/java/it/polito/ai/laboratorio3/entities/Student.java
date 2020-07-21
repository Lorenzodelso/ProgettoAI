package it.polito.ai.laboratorio3.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Student {
    @Id
    private String id;
    private String name;
    private String firstName;

    @OneToMany(mappedBy = "student")
    private List<Token> requests = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    @JoinTable(name = "student_course",joinColumns = @JoinColumn(name = "student_id"),inverseJoinColumns = @JoinColumn(name = "course_name"))
    private List<Course> courses = new ArrayList<>();

    @ManyToMany(mappedBy = "members")
    private List<Team> teams = new ArrayList<>();

    @OneToMany(mappedBy = "student")
    private List<Essay> essays = new ArrayList<>();

    public void addCourse(Course course){
        courses.add(course);
        course.getStudents().add(this);
    }

    public void addTeam(Team team){
        teams.add(team);
        team.getMembers().add(this);
    }

    public void removeTeam(Team team){
        teams.remove(team);
        team.getMembers().remove(this);
    }

    public void addRequest(Token token) {
        if(!this.requests.contains(token))
            this.requests.add(token);
    }

    public void unsubscribe(Course course) {
        if(!this.courses.contains(course))
            return;

        this.courses.remove(course);
        course.unsubscribe(this);
    }

    public void addEssay(Essay essay) {
        this.essays.add(essay);
    }
}
