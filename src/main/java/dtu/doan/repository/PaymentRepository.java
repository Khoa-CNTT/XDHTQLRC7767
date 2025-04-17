package dtu.doan.repository;

import dtu.doan.model.Payment;
import dtu.doan.model.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Promotion, Long> {
    Payment save(Payment payment);

    @Query(value = "select * from payment",nativeQuery = true)
    Page<Payment>getPageOfPayment(Pageable pageable);
}
