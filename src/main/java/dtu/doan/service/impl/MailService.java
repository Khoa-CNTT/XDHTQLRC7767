package dtu.doan.service.impl;


import dtu.doan.model.Ticket;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;


@Service
public class MailService {
    private final JavaMailSender mailSender;
    private static final Logger logger = LoggerFactory.getLogger(MailService.class);

    @Autowired
    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Xác thực email đăng ký");
        message.setText("Xin chào,\n\nVui lòng nhấp vào link sau để xác thực email của bạn:\n%s\n\nLink này sẽ hết hạn sau 24 giờ." + "http://localhost:8080/confirm?token=" + token);
        try {
            mailSender.send(message);
            logger.info("Verification email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Error sending email", e);
        }
    }

    public void sendResetPasswordEmail(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Đặt lại mật khẩu");
        message.setText("Xin chào,\n\n" +
                "Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào link sau để đặt lại mật khẩu:\n" +
                "http://localhost:8080/reset-password?token=" + "\n\n" +
                "Link này sẽ hết hạn sau 24 giờ.\n\n" +
                "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.");

        try {
            mailSender.send(message);
            logger.info("Reset password email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send reset password email to: {}", to, e);
            throw new RuntimeException("Error sending email", e);
        }
    }
    public void sendEmailWithQrCode(String to, String subject, String body, byte[] qrCodeImage, String qrCodeImageName) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true); // Set true để nội dung email hỗ trợ HTML

        // Đính kèm mã QR
        helper.addAttachment(qrCodeImageName, new ByteArrayResource(qrCodeImage));

        mailSender.send(message);
    }

    public String generateEmailBody(Ticket ticket) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");

        String movieTitle = ticket.getShowTime().getMovie().getName(); // Lấy tên phim
        String showDate = dateFormat.format(ticket.getShowTime().getDate()); // Ngày chiếu
        String startTime = timeFormat.format(ticket.getShowTime().getStartTime()); // Giờ bắt đầu
        String endTime = timeFormat.format(ticket.getShowTime().getEndTime()); // Giờ kết thúc
        String seatNumber = ticket.getChairs().getName(); // Số ghế
        String cinemaName = ticket.getShowTime().getRoom().getCinema().getName(); // Cụm rạp
        String roomName = ticket.getShowTime().getRoom().getName(); // Phòng chiếu

        return String.format("""
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Poppins', Arial, sans-serif;
                        color: #E0E0E0;
                        text-align: center;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background: #1E1E1E;
                        border-radius: 12px;
                        box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
                        color: #D0D0D0;
                    }
                    h2 {
                        color: #FFD700;
                        font-size: 26px;
                        margin-bottom: 15px;
                    }
                    .ticket-info {
                        background: #292929;
                        padding: 15px;
                        border-radius: 8px;
                        text-align: left;
                        border-left: 5px solid #FFD700;
                    }
                    .ticket-title {
                        color: #FFFFFF;
                        font-size: 20px;
                        font-weight: bold;
                        text-transform: uppercase;
                        margin-bottom: 12px;
                    }
                    .ticket-info p {
                        margin: 8px 0;
                        font-size: 16px;
                        color: #C0C0C0;
                    }
                    .highlight {
                        font-weight: bold;
                        color: #FFD700;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #B0B0B0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>🎟️ Xác nhận đặt vé xem phim 🎬</h2>
                    <p>Chào bạn, cảm ơn đã đặt vé tại hệ thống của chúng tôi.</p>
                    <p>Vui lòng kiểm tra thông tin vé bên dưới:</p>
                    <div class="ticket-info">
                        <p class="ticket-title">Thông tin vé</p>
                        <p><strong>🎬 Tên phim:</strong> %s</p>
                        <p><strong>📅 Ngày chiếu:</strong> %s</p>
                        <p><strong>🕒 Thời gian:</strong> %s - %s</p>
                        <p><strong>🪑 Số ghế:</strong> %s</p>
                        <p><strong>📍 Cụm rạp:</strong> %s</p>
                        <p><strong>🏠 Phòng chiếu:</strong> %s</p>
                    </div>
                    <p class="footer">Hãy đến sớm trước 15 phút để nhận vé và thưởng thức phim nhé!</p>
                    <p class="footer"><strong>Trân trọng,</strong><br>Đội ngũ Rạp Chiếu Phim</p>
                </div>
            </body>
            </html>
            """,
                movieTitle,
                showDate,
                startTime,
                endTime,
                seatNumber,
                cinemaName,
                roomName
        );
    }


}