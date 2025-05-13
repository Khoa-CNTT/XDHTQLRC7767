package dtu.doan.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import dtu.doan.model.Ticket;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class BookingService {
    @Autowired
    private MailService mailServices;

    @Autowired
    private QRCodeService qrCodeService;

    public void processBooking(Ticket ticket) {
        // ... Logic xử lý đặt vé của bạn ...

        // Tạo dữ liệu cho mã QR từ thông tin đặt vé
        String qrData = generateQrData(ticket);

        try {
            // Tạo mã QR
            byte[] qrCodeImage = qrCodeService.generateQRCode(qrData, 200, 200);

            // Gửi email cho người dùng kèm mã QR
            String recipientEmail = ticket.getCustomer().getEmail(); // Lấy email của người dùng từ thông tin đặt vé
            String subject = "Thông tin vé xem phim của bạn";
            String emailBody = mailServices.generateEmailBody(ticket);
            String qrCodeImageName = "ma_qr_ve_" + ticket.getCode() + ".png";

            mailServices.sendEmailWithQrCode(recipientEmail, subject, emailBody, qrCodeImage, qrCodeImageName);

            System.out.println("Đã gửi email kèm mã QR thành công đến: " + recipientEmail);

        } catch (MessagingException e) {
            System.err.println("Lỗi khi gửi email: " + e.getMessage());
            // Xử lý lỗi gửi email
        }


    }


    private String generateQrData(Ticket ticket) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            String qrData = objectMapper.writeValueAsString(ticket);
            return qrData;
        } catch (Exception e) {
            e.printStackTrace();
            return "{}"; // Trả về JSON rỗng nếu có lỗi
        }
    }




}
