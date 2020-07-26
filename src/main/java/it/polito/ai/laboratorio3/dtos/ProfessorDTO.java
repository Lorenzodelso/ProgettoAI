package it.polito.ai.laboratorio3.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfessorDTO {
    private String id;
    private String name;
    private String firstName;

    public ProfessorDTO(){}
}
