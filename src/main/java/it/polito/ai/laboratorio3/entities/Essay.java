package it.polito.ai.laboratorio3.entities;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Essay {

    public enum stati {Null, Letto, Consegnato, Rivisto}

    @Id
    @GeneratedValue
    private Long id;
    private boolean modificabile;
    private int voto;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private Team team;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private Task task;

    //corso e docente si possono prendere dal task

}
