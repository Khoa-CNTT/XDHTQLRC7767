package dtu.doan.repository;

import dtu.doan.model.Ticket;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Transactional
    @Modifying
    @Query("UPDATE Ticket t SET t.used = true WHERE t.id = ?1")
    void updateTicketStatusById(Long id);

    @Query("SELECT t FROM Ticket t WHERE t.customer.id = ?1")
    List<Ticket> findAllByCustomerId(Long customerId);


}
