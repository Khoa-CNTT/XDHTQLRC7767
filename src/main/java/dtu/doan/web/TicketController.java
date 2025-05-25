package dtu.doan.web;

import dtu.doan.dto.TicketHistoryDTO;
import dtu.doan.dto.TicketRequestDTO;
import dtu.doan.dto.TicketResponeDTO;
import dtu.doan.model.Payment;
import dtu.doan.model.Ticket;
import dtu.doan.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    /**
     * API để người dùng đặt nhiều vé (mỗi vé cho 1 ghế)
     */
    @PostMapping
    public ResponseEntity<TicketResponeDTO> createTickets(@RequestBody TicketRequestDTO ticketRequestDTO) {
        System.out.println("Received ticket request: " + ticketRequestDTO);
        TicketResponeDTO tickets = ticketService.saveTickets(ticketRequestDTO);
        return ResponseEntity.ok(tickets);
    }
    @PutMapping("/mobile/{id}")
    public ResponseEntity<?> updateTicketStatus(@PathVariable Long id) {
        ticketService.updateTicketStatus(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/mobile/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
         Ticket ticket = ticketService.getTicketByid(id);
        return ResponseEntity.ok(ticket);
    }
    @GetMapping("/customer/{id}")
    public ResponseEntity<List<TicketHistoryDTO>> getTicketByCustomerId(@PathVariable Long id) {
        List<Payment> tickets1 = ticketService.getTicketByCustomer(id);
        List<TicketHistoryDTO> ticketsRespone = new ArrayList<>();

        for (Payment ticket : tickets1) {
            int i = 0;
            TicketHistoryDTO ticketHistoryDTO = new TicketHistoryDTO();
            ticketHistoryDTO.setId(ticket.getId());
            ticketHistoryDTO.setDate(String.valueOf(ticket.getTickets().get(i).getShowTime().getDate()));
            ticketHistoryDTO.setStartTime(String.valueOf(ticket.getTickets().get(i).getShowTime().getStartTime()));
            ticketHistoryDTO.setCinemaName(ticket.getTickets().get(i).getShowTime().getRoom().getCinema().getName());
            ticketHistoryDTO.setMovieName(ticket.getTickets().get(i).getShowTime().getMovie().getName());
            ticketHistoryDTO.setTotalPrice(ticket.getAmount());

            // Tạo mới danh sách ghế cho mỗi vé
            List<String> chairNames = new ArrayList<>();
            for (Ticket t : ticket.getTickets()) {
                chairNames.add(t.getChairs().getName());
            }
            ticketHistoryDTO.setChairName(chairNames);

            ticketsRespone.add(ticketHistoryDTO);
            i++;
        }

        return ResponseEntity.ok(ticketsRespone);
    }

}
