package dtu.doan.service;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


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

}