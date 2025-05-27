package dtu.doan.web;

import dtu.doan.dto.DailyRevenueDTO;
import dtu.doan.dto.PaymentTicketDTO;
import dtu.doan.dto.RecentPaymentDTO;
import dtu.doan.model.Payment;
import dtu.doan.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    @Autowired
    PaymentService paymentService;

    @GetMapping()
    public ResponseEntity<Page<?>> getPageOfPayment(@RequestParam(value = "page", defaultValue = "0") int page) {
        Pageable pageable = PageRequest.of(page, 5, Sort.by("id").descending());
        Page<Payment> paymentPage = paymentService.getPageOfPayment(pageable);
        System.out.println(paymentPage);
        return ResponseEntity.ok(paymentPage);
    }

    @GetMapping("/total-revenue/{year}")
    public ResponseEntity<List<Object[]>> getTotalRevenueInYear(@PathVariable(value = "year") int year) {
        List<Object[]> result = paymentService.getMonthlyRevenueByYear(year);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PaymentTicketDTO>> getAllPayments() {
        List<PaymentTicketDTO> payments = paymentService.getAllPayments();
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }
    @GetMapping("/daily-revenue/{date}")
    public ResponseEntity<DailyRevenueDTO> getTotalRevenueIndate(@PathVariable(value = "date") LocalDate date) {
        return ResponseEntity.ok(paymentService.getRevenueAndTicketCountByDate(date));
    }
    @GetMapping("/statistics")
    public ResponseEntity<List<Object[]>> getPaymentStatistics(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Object[]> statistics = paymentService.getPaymentStatistics(startDate, endDate);
        return ResponseEntity.ok(statistics);
    }


    @GetMapping("/recent")
    public ResponseEntity<List<RecentPaymentDTO>> getRecentPayments(
            @RequestParam(value = "limit", defaultValue = "5") int limit,
            @RequestParam(value = "page", defaultValue = "0")int page) {
        List<RecentPaymentDTO> recentPayments = paymentService.getRecentPayments(page,limit);
        return new ResponseEntity<>(recentPayments, HttpStatus.OK);
    }


}
