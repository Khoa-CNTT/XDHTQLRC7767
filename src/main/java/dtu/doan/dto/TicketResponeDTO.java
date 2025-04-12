package dtu.doan.dto;

import dtu.doan.model.Chair;
import dtu.doan.model.Customer;
import dtu.doan.model.Payment;
import dtu.doan.model.ShowTime;
import lombok.Data;

import java.util.Date;
import java.util.List;
@Data
public class TicketResponeDTO {
    private Boolean used;
    private String type;
    private Date date;
    private ShowTime showTime;
    private List<Chair> chairs;
    private Customer customer;
    private Payment payment;
}
