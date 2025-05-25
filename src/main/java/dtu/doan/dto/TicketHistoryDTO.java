package dtu.doan.dto;

import lombok.Data;

import java.util.List;

@Data
public class TicketHistoryDTO {
    private Long id;
    private String movieName;
    private String date;
    private String cinemaName;
    private String startTime;
    private List<String> ChairName;
    private Double totalPrice;
}
