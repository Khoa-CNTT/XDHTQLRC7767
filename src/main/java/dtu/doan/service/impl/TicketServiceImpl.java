package dtu.doan.service.impl;

import dtu.doan.dto.TicketRequestDTO;
import dtu.doan.dto.TicketResponeDTO;
import dtu.doan.model.*;
import dtu.doan.repository.*;
import dtu.doan.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {
    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    TicketRepository ticketRepository;
    @Autowired
    ChairRepository chairRepository;
    @Autowired
    CustomerRepository customerRepository;
    @Autowired
    ShowTimeRepository showTimeRepository;
    @Autowired
    BookingService bookingService;
    @Override
    public List<TicketResponeDTO> saveTickets(TicketRequestDTO dto) {
        // Tạo payment trước
        Payment payment = new Payment();
        payment.setStatus("success");
        payment.setAmount(50000 * dto.getChairs().size()); // Hoặc tính theo tổng
        payment.setPaymentTime(new Date());
        payment = paymentRepository.save(payment);

        // Load dữ liệu cần thiết
        Customer customer = customerRepository.findById(dto.getCustomer().getId()).orElseThrow();
        ShowTime showTime = showTimeRepository.findById(dto.getShowTime().getId()).orElseThrow();

        List<TicketResponeDTO> ticketResponeList = new ArrayList<>();

        for (Chair chairReq : dto.getChairs()) {
            Chair chair = chairRepository.findById(chairReq.getId()).orElseThrow();

            Ticket ticket = new Ticket();
            ticket.setUsed(false);
            ticket.setType(dto.getType());
            ticket.setDate(new Date());
            ticket.setShowTime(showTime);
            ticket.setCustomer(customer);
            ticket.setChairs(chair);
            ticket.setPayment(payment); // Gán vào cùng 1 payment
            Ticket savedTicket = ticketRepository.save(ticket);
            bookingService.processBooking(ticket);

            // Trả về DTO
            TicketResponeDTO res = new TicketResponeDTO();
            res.setUsed(savedTicket.getUsed());
            res.setType(savedTicket.getType());
            res.setDate(savedTicket.getDate());
            res.setShowTime(savedTicket.getShowTime());
            res.setChairs(List.of(savedTicket.getChairs()));
            res.setCustomer(savedTicket.getCustomer());
            res.setPayment(payment);

            ticketResponeList.add(res);
        }

        return ticketResponeList;
    }



}
