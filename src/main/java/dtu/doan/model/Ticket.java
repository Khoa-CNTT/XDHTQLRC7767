package dtu.doan.model;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@Entity
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
    @ManyToOne
    @JoinColumn(name = "chair_id")
    private Chair chair;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Customer customer;
}
