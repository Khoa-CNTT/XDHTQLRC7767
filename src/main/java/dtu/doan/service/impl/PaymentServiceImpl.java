package dtu.doan.service.impl;

import dtu.doan.dto.DailyRevenueDTO;
import dtu.doan.dto.PaymentTicketDTO;
import dtu.doan.dto.RecentPaymentDTO;
import dtu.doan.model.Payment;
import dtu.doan.model.Ticket;
import dtu.doan.repository.CustomerRepository;
import dtu.doan.repository.PaymentRepository;
import dtu.doan.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
        Page<Payment> payments = paymentRepository.getPageOfPayment(pageable);
        System.out.println(payments);
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
            paymentTicketDTO.setCustomerEmail(payment.getTickets().get(0).getCustomer().getEmail());
            paymentTicketDTO.setCustomerPhoneNumber(payment.getTickets().get(0).getCustomer().getPhoneNumber());
            List<String> ticketNames = new ArrayList<>();
            for (int i = 0; i < payment.getTickets().size(); i++) {
                ticketNames.add(payment.getTickets().get(i).getChairs().getName());
            }
            paymentTicketDTO.setTicketName(ticketNames);
            paymentTicketDTOS.add(paymentTicketDTO);
        }
        return paymentTicketDTOS;
    }

    @Override
    public List<RecentPaymentDTO> getRecentPayments(int page,int limit) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by(Sort.Direction.DESC, "date"));
        Page<Payment> paymentsPage = paymentRepository.findAll(pageable);
        List<Payment> payments = paymentsPage.getContent();

//        List<Payment> payments = paymentRepository.findAll(Sort.by(Sort.Direction.DESC, "date"));

        List<RecentPaymentDTO> recentPayments = new ArrayList<>();

        for (Payment payment : payments) {
            if (payment.getTickets() == null || payment.getTickets().isEmpty()) {
                continue; // Skip payments without tickets
            }

            RecentPaymentDTO dto = new RecentPaymentDTO();
            dto.setId(payment.getId());
            dto.setAmount(payment.getAmount());
            dto.setStatus(payment.getStatus());
            dto.setDate(payment.getDate());

            // Get customer name from the first ticket
            Ticket firstTicket = payment.getTickets().get(0);
            if (firstTicket.getCustomer() != null) {
                dto.setCustomer(firstTicket.getCustomer().getFullName());
            }

            // Get movie name from the first ticket's showtime
            if (firstTicket.getShowTime() != null && firstTicket.getShowTime().getMovie() != null) {
                dto.setMovieName(firstTicket.getShowTime().getMovie().getName());
            }

            recentPayments.add(dto);
        }

        return recentPayments;

    }


}
