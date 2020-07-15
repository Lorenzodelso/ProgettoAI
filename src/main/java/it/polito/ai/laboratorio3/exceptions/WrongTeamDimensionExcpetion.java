package it.polito.ai.laboratorio3.exceptions;

import it.polito.ai.laboratorio3.exceptions.TeamServiceException;

public class WrongTeamDimensionExcpetion extends TeamServiceException {
    public WrongTeamDimensionExcpetion(String err){
        super("Team dimension is wrong! "+ err);
    }
}
