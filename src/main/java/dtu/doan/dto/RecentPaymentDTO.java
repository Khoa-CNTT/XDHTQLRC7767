package dtu.doan.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RecentPaymentDTO {
    private Long id;
    private Double amount;
    private String status;
    private LocalDate date;
    private String customer;
    private String movieName;

}
