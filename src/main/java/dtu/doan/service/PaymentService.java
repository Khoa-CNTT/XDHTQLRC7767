package dtu.doan.service;

import dtu.doan.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {
    Page<Payment>getPageOfPayment(Pageable pageable);
}
