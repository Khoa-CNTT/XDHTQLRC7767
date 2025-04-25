package dtu.doan.dto;

import dtu.doan.model.Genre;
import lombok.Data;

import java.util.List;

@Data
public class MovieHomeResponseDTO {
    private Long id;
    private String title;
    private String duration;
    private String releaseDate;
    private String image;
    private List<Genre> genres; // New field for genres

}
