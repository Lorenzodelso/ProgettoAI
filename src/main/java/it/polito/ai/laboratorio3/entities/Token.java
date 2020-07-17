package it.polito.ai.laboratorio3.entities;

import lombok.Data;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.sql.Timestamp;

@Entity
@Data
public class Token {
    @Id
    String id;
    Long teamId;
    String courseName;
    Timestamp expiryDate;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private Student student;

    public void setStudent(Student student){
        this.student = student;
        student.addRequest(this);
    }
}
