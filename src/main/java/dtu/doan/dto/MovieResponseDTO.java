package dtu.doan.dto;

import dtu.doan.model.Genre;
import lombok.Data;

import java.util.Set;
@Data
public class MovieResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String director;
    private String actor;
    private int duration;
    private int releaseYear;
    private double rating;
    private Set<Genre> movieGenres;
}
