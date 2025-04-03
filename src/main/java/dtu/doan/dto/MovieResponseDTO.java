package dtu.doan.dto;

import dtu.doan.model.Genre;
import dtu.doan.model.Movie;
import lombok.Data;

import java.util.List;
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
    private String country;
    private String language;
    private String subtitle;
    private int ageLimit;
    private String content;

    private List<Genre> movieGenres;

}
