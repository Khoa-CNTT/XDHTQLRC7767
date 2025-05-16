package dtu.doan.service.impl;

import dtu.doan.dto.DailyRevenueDTO;
import dtu.doan.model.Payment;
import dtu.doan.repository.PaymentRepository;
import dtu.doan.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    PaymentRepository paymentRepository;
    @Override
    public Page<Payment> getPageOfPayment(Pageable pageable) {
        return paymentRepository.getPageOfPayment(pageable);
    }

    @Override
    public List<Object[]> getMonthlyRevenueByYear(int year) {
        return paymentRepository.getMonthlyRevenueByYear(year);
    }

    @Override
    public DailyRevenueDTO getRevenueAndTicketCountByDate(LocalDate date) {
        return paymentRepository.getRevenueAndTicketCountByDate(date);
    }
    @Override
    public List<Object[]> getPaymentStatistics(LocalDate startDate, LocalDate endDate) {
        return paymentRepository.findPaymentStatistics(startDate, endDate);
    }
}
