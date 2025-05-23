package dtu.doan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShowtimeStatisticsDTO{
    private Long showtimeId;
    private Long ticketsSold;
    private Double totalRevenue;
}
