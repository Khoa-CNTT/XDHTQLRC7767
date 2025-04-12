package dtu.doan.service;


import dtu.doan.dto.TicketRequestDTO;
import dtu.doan.dto.TicketResponeDTO;

import java.util.List;

public interface TicketService  {

    List<TicketResponeDTO> saveTickets(TicketRequestDTO dto);
}
