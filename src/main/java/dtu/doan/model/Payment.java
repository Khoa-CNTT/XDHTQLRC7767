package dtu.doan.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_payment;
    @ManyToOne
    @NotNull
    private Ticket ticket;
    @NotNull
    @DateTimeFormat
    private Date date;
    @NotNull
    private Float total_money;
}
