package dtu.doan.service;


import dtu.doan.dto.TicketRequestDTO;
import dtu.doan.dto.TicketResponeDTO;
import dtu.doan.model.Ticket;

import java.util.List;

public interface TicketService  {

    TicketResponeDTO saveTickets(TicketRequestDTO dto);
    void updateTicketStatus(Long id);
    Ticket getTicketByid(Long id);
    List<Ticket> getTicketByCustomer(Long id);
}
