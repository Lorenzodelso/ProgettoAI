package it.polito.ai.laboratorio3.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EssayDTO {

    public enum stati {Letto, Consegnato, Rivisto, Terminato}

    private Long id;
    private int voto;
    public stati stato;

    public EssayDTO(){}
}
