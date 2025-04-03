package dtu.doan.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.Set;

@Data
@Entity
@Table(indexes = {
        @Index(name = "idx_code", columnList = "code"),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_type", columnList = "type"),
        @Index(name = "idx_price", columnList = "price"),
        @Index(name = "idx_date", columnList = "date"),
})
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String status;
    private String type;
    private int price;
    @DateTimeFormat
    private Date date;
    @ManyToOne
    @JoinColumn(name = "show_time_id")
    private ShowTime showTime;
    @ManyToMany
    @JoinTable(name = "ticket_chair",
            joinColumns = @JoinColumn(name = "ticket_id"),
            inverseJoinColumns = @JoinColumn(name = "chair_id"))
    private Set<Chair> chairs;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Customer customer;
}
