package dtu.doan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
public class DailyRevenueDTO {
    private LocalDate date;
    private Double totalRevenue;
    private Long totalTickets;
    private Long totalCustomer;

    public DailyRevenueDTO() {
    }

    public DailyRevenueDTO(LocalDate date, Double totalRevenue, Long totalTickets, Long totalCustomer) {
        this.date = date;
        this.totalRevenue = totalRevenue;
        this.totalTickets = totalTickets;
        this.totalCustomer = totalCustomer;
    }

}
