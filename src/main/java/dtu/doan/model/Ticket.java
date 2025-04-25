package dtu.doan.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import dtu.doan.model.Chair;
import dtu.doan.model.Customer;
import dtu.doan.model.Payment;
import dtu.doan.model.ShowTime;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(indexes = {
        @Index(name = "idx_code", columnList = "code"),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_type", columnList = "type"),
        @Index(name = "idx_price", columnList = "price"),
        @Index(name = "idx_date", columnList = "date"),
},uniqueConstraints = {
        @UniqueConstraint(columnNames = {"code", "show_time_id"}),  // Đảm bảo mã vé không trùng
})
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
