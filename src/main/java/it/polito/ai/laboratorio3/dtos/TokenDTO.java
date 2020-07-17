package it.polito.ai.laboratorio3.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class TokenDTO {

    String id;
    Long teamId;
    Timestamp expiryDate;

    public TokenDTO (){}
}
