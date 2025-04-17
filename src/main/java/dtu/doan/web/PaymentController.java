package dtu.doan.web;

import dtu.doan.model.Payment;
import dtu.doan.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    @Autowired
    PaymentService paymentService;
    @GetMapping("")
    public ResponseEntity<Page<Payment>> getPageOfPayment(@RequestParam(defaultValue = "") int page){
        Pageable pageable = PageRequest.of(page, 5, Sort.by("id").descending());
        Page<Payment> paymentPage = paymentService.getPageOfPayment(pageable);
        return ResponseEntity.ok(paymentPage);
    }
}
