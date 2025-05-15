package dtu.doan.web;

import dtu.doan.dto.TicketHistoryDTO;
import dtu.doan.dto.TicketRequestDTO;
import dtu.doan.dto.TicketResponeDTO;
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
        List<Ticket> tickets1 = ticketService.getTicketByCustomer(id);
        List<TicketHistoryDTO> ticketsRespone= new ArrayList<>();

        for(Ticket ticket : tickets1){
            TicketHistoryDTO ticketHistoryDTO = new TicketHistoryDTO();
            ticketHistoryDTO.setId(ticket.getId());
            ticketHistoryDTO.setDate(String.valueOf(ticket.getShowTime().getDate()));
            ticketHistoryDTO.setStartTime(String.valueOf(ticket.getShowTime().getStartTime()));
            ticketHistoryDTO.setCinemaName(ticket.getShowTime().getRoom().getCinema().getName());
            ticketHistoryDTO.setMovieName(ticket.getShowTime().getMovie().getName());
            ticketsRespone.add(ticketHistoryDTO);
        }

        return ResponseEntity.ok(ticketsRespone);
    }


}
