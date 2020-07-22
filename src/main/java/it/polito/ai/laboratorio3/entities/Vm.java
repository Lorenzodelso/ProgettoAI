package it.polito.ai.laboratorio3.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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
    @Lob
    private byte[] screenVm;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private Team team;
    //il corso lo prende dal team

    @ManyToMany(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    @JoinTable(name = "students_vms",joinColumns = @JoinColumn(name = "student_id"),inverseJoinColumns = @JoinColumn(name = "vm_id"))
    private List<Student> owners = new ArrayList<>();

    public void addOwner( Student student){
        if(!owners.contains(student)){
            owners.add(student);
            student.addVm(this);
        }
    }
}
