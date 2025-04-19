package dtu.doan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
public class DailyRevenueDTO {
    private LocalDate date;
    private Long totalRevenue;
    private Long totalTickets;

    public DailyRevenueDTO(LocalDate date, Long totalRevenue, Long totalTickets) {
        this.date = date;
        this.totalRevenue = totalRevenue;
        this.totalTickets = totalTickets;
    }
}
