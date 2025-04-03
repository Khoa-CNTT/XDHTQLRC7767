package dtu.doan.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;


import java.util.Set;

@Data
@Entity
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    private boolean isDelete;
    @OneToMany(mappedBy = "movie")
    @JsonIgnore
    private Set<MovieGenre> movieGenres;

}
