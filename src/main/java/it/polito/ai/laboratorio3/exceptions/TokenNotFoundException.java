package it.polito.ai.laboratorio3.exceptions;

public class TokenNotFoundException extends TeamServiceException {
    public TokenNotFoundException(){
        super("Course not enabled!");
    }
}
