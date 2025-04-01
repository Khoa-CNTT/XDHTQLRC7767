package dtu.doan.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

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
    private String genre;
    private int duration;
    private int releaseYear;
    private double rating;
    private boolean isDelete;
    @OneToMany(mappedBy = "movie")
    @JsonIgnore
    private List<MovieAndType> getListType;
}
