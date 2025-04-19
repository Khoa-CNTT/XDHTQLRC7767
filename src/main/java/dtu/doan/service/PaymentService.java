package dtu.doan.service;

import dtu.doan.dto.DailyRevenueDTO;
import dtu.doan.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PaymentService {
    Page<Payment>getPageOfPayment(Pageable pageable);
    List<Object[]> getMonthlyRevenueByYear(int year);
    DailyRevenueDTO getRevenueAndTicketCountByDate(LocalDate date);
}
