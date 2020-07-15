package it.polito.ai.laboratorio3.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Team {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private int status;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToMany(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    @JoinTable(name = "team_student", joinColumns = @JoinColumn(name = "team_id"), inverseJoinColumns = @JoinColumn(name = "student_id"))
    private List<Student> members = new ArrayList<>();

    public void setCourse(Course course){
        if (course == null){
            this.course.getTeams().remove(this);
            this.course = null;
        }
        else {
            this.course = course;
            course.getTeams().add(this);
        }
    }

    public void addMember(Student member){
        members.add(member);
        member.getTeams().add(this);
    }

    public void removeMember(Student student){
        members.remove(student);
        student.getTeams().remove(this);
    }
}
