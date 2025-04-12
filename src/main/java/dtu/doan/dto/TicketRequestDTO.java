package dtu.doan.dto;

import dtu.doan.model.Chair;
import dtu.doan.model.Customer;
import dtu.doan.model.ShowTime;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Data
public class TicketRequestDTO {
    private Boolean used;
    private String type;
    private Date date;
    private ShowTime showTime;
    private List<Chair> chairs;
    private Customer customer;
}
