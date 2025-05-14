package dtu.doan.service.impl;

import dtu.doan.dto.ChairDTO;
import dtu.doan.dto.TicketRequestDTO;
import dtu.doan.dto.TicketResponeDTO;
import dtu.doan.model.*;
import dtu.doan.repository.*;
import dtu.doan.service.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

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

    @Transactional
    @Override
    public TicketResponeDTO saveTickets(TicketRequestDTO dto) {
        // Tạo payment trước
        Payment payment = new Payment();
        payment.setStatus("success");
        payment.setAmount(dto.getPrice());
        payment.setDate(LocalDate.now());
        payment = paymentRepository.save(payment);

        // Kiểm tra và lấy Customer
        Customer customer = customerRepository.findById(dto.getId_customer())
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + dto.getId_customer()));

        // Kiểm tra và lấy ShowTime
        ShowTime showTime = showTimeRepository.findById(dto.getId_showTime())
                .orElseThrow(() -> new RuntimeException("ShowTime not found with ID: " + dto.getId_showTime()));

        Ticket savedTicket = new Ticket();
        List<ChairDTO> chairDTOList = new ArrayList<>();
        // Kiểm tra và lấy Chair
        for (Long chairId : dto.getChairIds()) {
            Chair chair = chairRepository.findById(chairId)
                    .orElseThrow(() -> new RuntimeException("Chair not found with ID: " + chairId));

            // Cập nhật trạng thái ghế
            chairRepository.updateChairStatus(chair.getId(), "BOOKED");
            chair.setStatus("BOOKED");
            Ticket ticket = new Ticket();
            ticket.setUsed(false);
            ticket.setType(dto.getType());
            ticket.setShowTime(showTime);
            ticket.setCustomer(customer);
            ticket.setChairs(chair);
            ticket.setPayment(payment);

            savedTicket = ticketRepository.save(ticket);
            bookingService.processBooking(savedTicket);

            // Chuyển sang DTO để trả về
            ChairDTO chairDTO = new ChairDTO(
                    chair.getId(),
                    chair.getName(),
                    chair.getType(),
                    chair.getStatus()
            );
            chairDTOList.add(chairDTO);
        }

        // Trả về DTO
        TicketResponeDTO res = new TicketResponeDTO();
        res.setType(savedTicket.getType());
        res.setShowTime(savedTicket.getShowTime());
        res.setCustomer(savedTicket.getCustomer());
        res.setChairDTOS(chairDTOList);
        res.setPayment(payment);

        return res;
    }


    @Override
    public void updateTicketStatus(Long id) {
        ticketRepository.updateTicketStatusById(id);
    }

    @Override
    public Ticket getTicketByid(Long id) {
        return ticketRepository.getById(id);
    }
//    @Scheduled(fixedRate = 60000) // chạy mỗi 60 giây
//    public void updateSeatStatusAfterShowtime() {
//        LocalDateTime now = LocalDateTime.now();
//        List<ShowTime> endedShowtimes = showTimeRepository.findByStatusAndDateBeforeNow();
//
//        for (ShowTime showtime : endedShowtimes) {
//            List<Chair> chairList = chairRepository.findAllChairViewByShowTimeId(showtime.getId());
//
//            for (Chair chair : chairList) {
//                 chairRepository.updateChairStatus(
//                         chair.getId(),"AVAILABLE"
//                 );
//            }
//        }
//    }


}
