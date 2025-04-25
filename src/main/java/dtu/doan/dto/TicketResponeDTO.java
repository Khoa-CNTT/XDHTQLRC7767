package dtu.doan.dto;

import dtu.doan.model.Chair;
import dtu.doan.model.Customer;
import dtu.doan.model.Payment;
import dtu.doan.model.ShowTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponeDTO {
    private String type;
    private ShowTime showTime;
    private Customer customer;
    private Payment payment;
    List<ChairDTO> chairDTOS;

}
