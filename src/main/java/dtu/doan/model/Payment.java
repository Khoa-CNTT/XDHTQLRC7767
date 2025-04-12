package dtu.doan.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import dtu.doan.model.Ticket;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int amount;

    private String status; // Ví dụ: PENDING, SUCCESS, FAILED

    @Temporal(TemporalType.TIMESTAMP)
    private Date paymentTime;

    @OneToMany(mappedBy = "payment")
    @JsonBackReference
    private List<Ticket> tickets; // Một payment có thể có nhiều vé
}
