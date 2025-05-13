package dtu.doan.service.impl;


import dtu.doan.model.Chair;
import dtu.doan.model.Ticket;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;


@Service
public class MailService {
    private final JavaMailSender mailSender;
    private static final Logger logger = LoggerFactory.getLogger(MailService.class);

    @Autowired
    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String to, String token) {
        try {
            String link = "http://localhost:8080/confirm?token=" + token;

            String htmlContent = """
                    <html>
                    <body style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #333;">Xác thực địa chỉ email của bạn</h2>
                        <p>Xin chào,</p>
                        <p>Vui lòng nhấn vào nút bên dưới để xác thực email của bạn:</p>
                        <a href="%s" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Xác thực ngay
                        </a>
                        <p style="margin-top: 20px;">Liên kết này sẽ hết hạn sau 24 giờ.</p>
                        <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
                    </body>
                    </html>
                    """.formatted(link);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Xác thực email đăng ký");
            helper.setText(htmlContent, true); // true => gửi HTML

            mailSender.send(mimeMessage);
            logger.info("Verification email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Error sending email", e);
        }
    }


    public void sendResetPasswordEmail(String to, String token) {
        try {
            String resetUrl = "http://localhost:5173/forget-password?token=" + token;

            String htmlContent = """
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body {
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                background-color: #f9f9f9;
                                padding: 20px;
                                color: #333;
                            }
                            .container {
                                background-color: #ffffff;
                                border-radius: 10px;
                                padding: 30px;
                                max-width: 600px;
                                margin: 40px auto;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                                text-align: center;
                            }
                            .btn {
                                display: inline-block;
                                padding: 12px 24px;
                                margin-top: 20px;
                                background-color: #007bff;
                                color: white;
                                text-decoration: none;
                                border-radius: 8px;
                                font-weight: bold;
                                transition: background-color 0.3s ease;
                            }
                            .btn:hover {
                                background-color: #0056b3;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>🔒 Đặt lại mật khẩu</h2>
                            <p>Xin chào,</p>
                            <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào nút bên dưới để tiếp tục:</p>
                            <a href="%s" class="btn">Đặt lại mật khẩu</a>
                            <p style="margin-top: 30px;">Liên kết này sẽ hết hạn sau 24 giờ.</p>
                            <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
                        </div>
                    </body>
                    </html>
                    """.formatted(resetUrl);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Đặt lại mật khẩu");
            helper.setText(htmlContent, true); // true => gửi nội dung HTML

            mailSender.send(mimeMessage);
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


        String movieTitle = ticket.getShowTime().getMovie().getName(); // Lấy tên phim
        LocalDate showDate = ticket.getShowTime().getDate(); // Ngày chiếu
        LocalTime startTime =ticket.getShowTime().getStartTime(); // Giờ bắt đầu
        LocalTime endTime = ticket.getShowTime().getEndTime(); // Giờ kết thúc
        String seatNumber = ticket.getChairs().getName(); // Số ghế
        String cinemaName = ticket.getShowTime().getRoom().getCinema().getName(); // Cụm rạp
        String roomName = ticket.getShowTime().getRoom().getName(); // Phòng chiếu

        return String.format("""
        <html>
        <head>
            <style>
                body {
                    font-family: 'Poppins', Arial, sans-serif;
                    color: #D0E7FF;
                    background-color: #0B1727;
                    text-align: center;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background: #132238;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
                    color: #D0E7FF;
                }
                h2 {
                    color: #66B2FF;
                    font-size: 26px;
                    margin-bottom: 15px;
                }
                .ticket-info {
                    background: #1A2B40;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: left;
                    border-left: 5px solid #66B2FF;
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
                    color: #BFDFFF;
                }
                .highlight {
                    font-weight: bold;
                    color: #66B2FF;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #A0BFD0;
                }
                  p {
                        color: #E0E0E0; /* hoặc #FFFFFF nếu muốn trắng hoàn toàn */
                        font-size: 16px;
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