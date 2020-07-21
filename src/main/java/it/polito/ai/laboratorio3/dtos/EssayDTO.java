package it.polito.ai.laboratorio3.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EssayDTO {
    private Long id;
    private boolean modificabile;
    private int voto;

    public EssayDTO(){}
}
