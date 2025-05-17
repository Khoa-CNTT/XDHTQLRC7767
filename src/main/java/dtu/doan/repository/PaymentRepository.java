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
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment save(Payment payment);

    @Query(value = "select * from payment", nativeQuery = true)
    Page<Payment> getPageOfPayment(Pageable pageable);
    @Query(value = """
            SELECT p
            FROM Payment p
            WHERE p.status = 'SUCCESS'
            ORDER BY p.date DESC
            """)
    List<Payment> findAll();

    @Query(value = """
            SELECT 
                MONTH(p.date) AS month,
                SUM(p.amount) AS total_revenue
            FROM payment p
            WHERE YEAR(p.date) = :year AND p.status = 'SUCCESS'
            GROUP BY MONTH(p.date)
            ORDER BY month
            """, nativeQuery = true)
    List<Object[]> getMonthlyRevenueByYear(@Param("year") int year);

    @Query("""
    SELECT FUNCTION('DATE', p.date), SUM(p.amount), COUNT(p)
    FROM Payment p
    WHERE p.status = 'SUCCESS' AND FUNCTION('DATE', p.date) = :date
    GROUP BY FUNCTION('DATE', p.date)
    """)
    Object getRevenueAndTicketCountByDate(@Param("date") LocalDate date);

    @Query("""
                SELECT p.date, SUM(p.amount) AS totalRevenue, COUNT(p.id) AS totalPayments
                FROM Payment p
                WHERE p.date BETWEEN :startDate AND :endDate
                GROUP BY p.date
                ORDER BY p.date ASC
            """)
    List<Object[]> findPaymentStatistics(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

}
