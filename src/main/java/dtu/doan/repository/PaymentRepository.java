package dtu.doan.repository;

import dtu.doan.dto.DailyRevenueDTO;
import dtu.doan.model.Payment;
import dtu.doan.model.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Promotion, Long> {
    Payment save(Payment payment);

    @Query(value = "select * from payment", nativeQuery = true)
    Page<Payment> getPageOfPayment(Pageable pageable);

    @Query(value = """
            SELECT 
                MONTH(p.payment_time) AS month,
                SUM(p.amount) AS total_revenue
            FROM payment p
            WHERE YEAR(p.payment_time) = :year AND p.status = 'SUCCESS'
            GROUP BY MONTH(p.payment_time)
            ORDER BY month
            """, nativeQuery = true)
    List<Object[]> getMonthlyRevenueByYear(@Param("year") int year);

    @Query("""
            SELECT DailyRevenueDTO(
                FUNCTION('DATE', p.paymentTime),
                SUM(p.amount),
                COUNT(t)
            )
            FROM Payment p
            JOIN p.tickets t
            WHERE p.status = 'SUCCESS' AND FUNCTION('DATE', p.paymentTime) = :date
            GROUP BY FUNCTION('DATE', p.paymentTime)
            """)
    DailyRevenueDTO getRevenueAndTicketCountByDate(@Param("date") LocalDate date);

}
