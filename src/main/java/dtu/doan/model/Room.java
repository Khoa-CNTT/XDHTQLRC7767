package dtu.doan.model;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(indexes = {
        @Index(name = "idx_room_name", columnList = "name"),
        @Index(name = "idx_room_type", columnList = "type"),
        @Index(name = "idx_room_capacity", columnList = "capacity"),
        @Index(name = "idx_room_status", columnList = "status")
})
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
