package it.polito.ai.laboratorio3.entities;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Vm {

    public enum stati {Accesa, Spenta}

    @Id
    @GeneratedValue
    private Long id;
    private int vcpu;
    private int GBDisk;
    private int GBRam;
    private stati status;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private Team team;
    //il corso lo prende dal team

}
