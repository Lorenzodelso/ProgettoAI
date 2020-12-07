package it.polito.ai.laboratorio3.entities;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Data
public class Token {
    @Id
    String id;
    Long teamId;
    String courseName;
    @Temporal(TemporalType.TIMESTAMP)
    Timestamp expiryDate;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private Student student;

    public void setStudent(Student student){
        this.student = student;
        student.addRequest(this);
    }
}
