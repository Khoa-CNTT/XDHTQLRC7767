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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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
        payment.setAmount((dto.getPrice()));
        payment.setPaymentTime(new Date());
        payment = paymentRepository.save(payment);

        Customer customer = customerRepository.findById(dto.getId_customer()).orElseThrow();
        ShowTime showTime = showTimeRepository.findById(dto.getId_showTime()).orElseThrow();
        List<ChairDTO> chairDTOList = new ArrayList<>();
        for (Long chairId : dto.getChairIds()) {
            Chair chair = chairRepository.findById(chairId)
                    .orElseThrow(() -> new RuntimeException("Chair not found: " + chairId));

            // Cập nhật trạng thái
            chairRepository
                    .updateChairStatus(chair.getId()
                            , "BOOKED");

            // Chuyển sang DTO để trả về
            ChairDTO chairDTO = new ChairDTO(
                    chair.getId(),
                    chair.getName(),
                    chair.getType(),
                    chair.getStatus()
            );
            chairDTOList.add(chairDTO);
        }

        Ticket ticket = new Ticket();
        ticket.setUsed(false);
        ticket.setType(dto.getType());
        ticket.setDate(new Date());
        ticket.setShowTime(showTime);
        ticket.setCustomer(customer);
        ticket.setPayment(payment); // Gán vào cùng 1 payment
        Ticket savedTicket = ticketRepository.save(ticket);
        bookingService.processBooking(ticket);

        // Trả về DTO
        TicketResponeDTO res = new TicketResponeDTO();
        res.setType(savedTicket.getType());
        res.setDate(savedTicket.getDate());
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
