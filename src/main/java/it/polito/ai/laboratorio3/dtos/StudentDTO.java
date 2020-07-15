package it.polito.ai.laboratorio3.dtos;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

@Data
@AllArgsConstructor
public class StudentDTO extends RepresentationModel<StudentDTO> {
    @CsvBindByName
    private String id;
    @CsvBindByName
    private String firstName;
    @CsvBindByName
    private String name;

    public StudentDTO(){}
}
