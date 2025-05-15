package dtu.doan.dto;

import lombok.Data;

@Data
public class TicketHistoryDTO {
    private Long id;
    private String movieName;
    private String date;
    private String cinemaName;
    private String startTime;
}
