package dtu.doan.model;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(indexes = {
        @Index(name = "idx_name", columnList = "name"),
        @Index(name = "idx_type", columnList = "type"),
        @Index(name = "idx_status", columnList = "status"),
})
public class  Chair {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private String status;
    @ManyToOne
    @JoinColumn
    private ShowTime showTime;



}
