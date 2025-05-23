package dtu.doan.service.impl;

import dtu.doan.dto.DailyRevenueDTO;
import dtu.doan.dto.PaymentTicketDTO;
import dtu.doan.model.Payment;
import dtu.doan.repository.CustomerRepository;
import dtu.doan.repository.PaymentRepository;
import dtu.doan.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    CustomerRepository customerRepository;
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
        DailyRevenueDTO dailyRevenueDTO = new DailyRevenueDTO();
        Object result = paymentRepository.getRevenueAndTicketCountByDate(date);
        if (result != null) {
            Object[] data = (Object[]) result;
            dailyRevenueDTO.setDate(date);
            dailyRevenueDTO.setTotalRevenue((Double) data[1]);
            dailyRevenueDTO.setTotalTickets((Long) data[2]);
            dailyRevenueDTO.setTotalCustomer(customerRepository.sumById());
        } else {
            dailyRevenueDTO.setDate(date);
            dailyRevenueDTO.setTotalRevenue(0.0);
            dailyRevenueDTO.setTotalTickets(0L);
            dailyRevenueDTO.setTotalCustomer(customerRepository.sumById());
        }
        return dailyRevenueDTO;
    }
    @Override
    public List<Object[]> getPaymentStatistics(LocalDate startDate, LocalDate endDate) {
        return paymentRepository.findPaymentStatistics(startDate, endDate);
    }

    @Override
    public List<PaymentTicketDTO> getAllPayments() {
        List<Payment> payments =  paymentRepository.findAll();
        List<PaymentTicketDTO> paymentTicketDTOS = new ArrayList<>();
        for (Payment payment : payments) {
            PaymentTicketDTO paymentTicketDTO = new PaymentTicketDTO();
            paymentTicketDTO.setPaymentDate(payment.getDate());
            paymentTicketDTO.setPaymentAmount(payment.getAmount());
            paymentTicketDTO.setPaymentStatus(payment.getStatus());
            paymentTicketDTO.setPaymentId(payment.getId());
            paymentTicketDTO.setMovieName(payment.getTickets().get(0).getShowTime().getMovie().getName());
            paymentTicketDTO.setCinemaName(payment.getTickets().get(0).getShowTime().getRoom().getCinema().getName());
            paymentTicketDTO.setRoomName(payment.getTickets().get(0).getShowTime().getRoom().getName());
            paymentTicketDTO.setShowDate(payment.getTickets().get(0).getShowTime().getDate());
            paymentTicketDTO.setShowTime(payment.getTickets().get(0).getShowTime().getStartTime());
            paymentTicketDTO.setCustomerName(payment.getTickets().get(0).getCustomer().getFullName());
            List<String> ticketNames = new ArrayList<>();
            for (int i = 0; i < payment.getTickets().size(); i++) {
                ticketNames.add(payment.getTickets().get(i).getChairs().getName());
            }
            paymentTicketDTO.setTicketName(ticketNames);
            paymentTicketDTOS.add(paymentTicketDTO);
        }
        return paymentTicketDTOS;
    }


}
