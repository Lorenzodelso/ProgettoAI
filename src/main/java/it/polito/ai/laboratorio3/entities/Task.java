package it.polito.ai.laboratorio3.entities;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Task {

    @Id
    @GeneratedValue
    private Long id;
    Timestamp dataRilascio;
    Timestamp dataScadenza;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private Course course;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private Docente docente;

    @OneToMany(mappedBy = "task")
    private List<Essay> essays = new ArrayList<>();
}
