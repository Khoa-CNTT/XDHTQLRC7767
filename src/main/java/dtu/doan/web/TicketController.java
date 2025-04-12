package dtu.doan.web;

import dtu.doan.dto.TicketRequestDTO;
import dtu.doan.dto.TicketResponeDTO;
import dtu.doan.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    /**
     * API để người dùng đặt nhiều vé (mỗi vé cho 1 ghế)
     */
    @PostMapping("")
    public ResponseEntity<List<TicketResponeDTO>> createTickets(@RequestBody TicketRequestDTO ticketRequestDTO) {
        System.out.println("Received ticket request: " + ticketRequestDTO);
        List<TicketResponeDTO> tickets = ticketService.saveTickets(ticketRequestDTO);
        return ResponseEntity.ok(tickets);
    }
}
