package it.polito.ai.laboratorio3.entities;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Essay {

    public enum stati {Letto, Consegnato, Rivisto}

    @Id
    @GeneratedValue
    private Long id;
    private boolean modificabile;
    private int voto;
    private stati stato;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private Student student;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private Task task;

    //corso e docente si possono prendere dal task
    public void setStudent(Student student){
        this.student = student;
        student.addEssay(this);
    }

    public void setTask(Task task){
        this.task = task;
        task.addEssay(this);
    }

}
