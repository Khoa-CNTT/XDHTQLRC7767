package dtu.doan.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDate;
import java.util.Set;

@Data
@Entity
@Table(indexes = {
        @Index(name = "idx_movie_name", columnList = "name"),
        @Index(name = "idx_movie_director", columnList = "director"),
        @Index(name = "idx_movie_actor", columnList = "actor"),
},uniqueConstraints = {
        @UniqueConstraint(columnNames = "name"),
})
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
    private LocalDate releaseDate;
    private int status;
}