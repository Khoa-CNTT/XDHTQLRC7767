package dtu.doan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketRequestDTO {
    private String type;
    private Double price;
    private Long id_showTime;
    private Long id_customer;
    private LocalDate date; // Import java.time.LocalDate
    private List<Long> chairIds;
}
