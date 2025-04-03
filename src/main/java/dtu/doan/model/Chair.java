package dtu.doan.model;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
public class Chair {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private int capacity;
    private String status;
    @OneToOne
    @JoinColumn(name = "room_id")
    private Room room;
    @ManyToMany(mappedBy = "chairs")
    private Set<Ticket> tickets;
}
