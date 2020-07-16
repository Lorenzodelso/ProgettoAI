package it.polito.ai.laboratorio3.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
public class Docente extends Student{

    @OneToMany(mappedBy = "docente")
    List<Task> tasks = new ArrayList<>();

}
