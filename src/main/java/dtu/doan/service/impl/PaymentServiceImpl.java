package dtu.doan.service.impl;

import dtu.doan.model.Payment;
import dtu.doan.repository.PaymentRepository;
import dtu.doan.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    PaymentRepository paymentRepository;
    @Override
    public Page<Payment> getPageOfPayment(Pageable pageable) {
        return paymentRepository.getPageOfPayment(pageable);
    }
}
