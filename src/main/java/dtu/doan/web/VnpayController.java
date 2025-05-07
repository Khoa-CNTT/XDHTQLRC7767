package dtu.doan.web;

import dtu.doan.service.impl.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class VnpayController {

    @Autowired
    private VNPayService vnPayService;

    @GetMapping("/create")
    public ResponseEntity<?> createPayment(@RequestParam long amount, @RequestParam String orderInfo, HttpServletRequest request) throws UnsupportedEncodingException {
        String ip = request.getRemoteAddr();
        String paymentUrl = vnPayService.createPaymentUrl(amount, orderInfo, ip);
        return ResponseEntity.ok(Collections.singletonMap("paymentUrl", paymentUrl));
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(@RequestParam Map<String, String> params) {
        // TODO: Kiểm tra vnp_SecureHash có hợp lệ không
        // Trả về trạng thái đơn hàng (thành công/thất bại)
        return ResponseEntity.ok(params);
    }
}
