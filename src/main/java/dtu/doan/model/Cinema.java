package dtu.doan.model;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Cinema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
    private String phone;
    private String email;
    private String imageUrl;
    private boolean isDelete;
    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;
}
