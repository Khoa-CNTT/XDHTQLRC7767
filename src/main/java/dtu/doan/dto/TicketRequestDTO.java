package dtu.doan.dto;

import dtu.doan.model.Chair;
import dtu.doan.model.Customer;
import dtu.doan.model.ShowTime;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketRequestDTO {
    private String type;
    private Date date;
    private Long price;
    private ShowTime showTime;
    private List<Chair> chairs;
    private Customer customer;

}
