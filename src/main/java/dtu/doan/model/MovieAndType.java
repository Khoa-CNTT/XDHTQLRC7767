package dtu.doan.model;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class MovieAndType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "movie_type_id")
    private MovieType movieType;
}
