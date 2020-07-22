package it.polito.ai.laboratorio3.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    //TODO per ora i dati contenuti nell'essay sono banalmente una stringa
    // concordare come mappare i dati di una consegna anche lato client (magari un file?)
    private String data;

    @OneToMany(mappedBy = "essay")
    private List<Image> images = new ArrayList<>();

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
