package dtu.doan.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table()
public class SeatFormat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
}