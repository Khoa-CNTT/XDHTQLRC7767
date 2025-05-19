package dtu.doan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieStatisticsDTO {
    private String movieTitle;
    private int showtimesCount;
    private int ticketsSold;
    private long revenue;
}
