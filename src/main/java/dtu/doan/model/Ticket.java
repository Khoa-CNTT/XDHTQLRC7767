package dtu.doan.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(indexes = {
        @Index(name = "idx_code", columnList = "code"),
        @Index(name = "idx_type", columnList = "type"),
        @Index(name = "idx_price", columnList = "price"),
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private Boolean used;
    private String type;
    private int price;

    @ManyToOne
    @JoinColumn(name = "show_time_id")
    private ShowTime showTime;

    @OneToOne
    private Chair chairs;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "payment_id")
    private Payment payment; // Mối quan hệ với Payment


}
