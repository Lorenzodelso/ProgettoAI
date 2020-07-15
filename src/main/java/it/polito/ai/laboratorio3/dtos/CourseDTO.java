package it.polito.ai.laboratorio3.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

@Data
@AllArgsConstructor
public class CourseDTO extends RepresentationModel<CourseDTO> {
    private String name;
    private int min;
    private int max;
    private boolean enabled;

    public CourseDTO(){}

}
