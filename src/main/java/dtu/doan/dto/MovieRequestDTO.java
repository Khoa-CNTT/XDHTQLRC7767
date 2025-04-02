package dtu.doan.dto;

import lombok.Data;

import java.util.List;
@Data
public class MovieRequestDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String director;
    private String actor;
    private int duration;
    private int releaseYear;
    private double rating;
    private List<Long> genreIds;
}
