package dtu.doan.model;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private int capacity;
    private String status;
    @OneToOne
    @JoinColumn(name = "cinema_id")
    private Cinema cinema;
}
