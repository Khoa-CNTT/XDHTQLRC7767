package dtu.doan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentTicketDTO {
    private Long paymentId;
    private LocalDate paymentDate;
    private Double paymentAmount;
    private String paymentStatus;
    private List<String> ticketName;
    private String cinemaName;
    private String roomName;
    private LocalDate showDate;
    private LocalTime showTime;
    private String movieName;
}
