package it.polito.ai.laboratorio3.entities;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Data
public class Image {
    @Id
    @GeneratedValue
    private String id;
    private String filename;
    private Timestamp creationDate;

    @Lob
    private byte[] data;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private Essay essay;

    public Image(){ }
}
