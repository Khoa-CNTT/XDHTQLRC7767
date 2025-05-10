package dtu.doan.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

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
    @ManyToOne
    @JoinColumn(name = "cinema_id")
    private Cinema cinema;


}
