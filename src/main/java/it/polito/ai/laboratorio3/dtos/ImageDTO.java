package it.polito.ai.laboratorio3.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class ImageDTO {
    private String id;
    private String filename;
    private Timestamp creationDate;
    private byte[] data;
}
