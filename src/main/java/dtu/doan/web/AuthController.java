package dtu.doan.web;

import dtu.doan.dto.AuthRequest;
import dtu.doan.dto.ChangePasswordRequest;
import dtu.doan.dto.RegisterRequest;
import dtu.doan.dto.SaveNewPasswordRequest;
import dtu.doan.model.Account;
import dtu.doan.model.Customer;
import dtu.doan.model.VerificationToken;
import dtu.doan.repository.AccountRepository;
import dtu.doan.repository.CustomerRepository;
import dtu.doan.repository.VerificationTokenRepository;
import dtu.doan.service.AccountService;
import dtu.doan.service.CustomerService;
import dtu.doan.service.impl.MailService;
import dtu.doan.service.impl.VerificationService;
import dtu.doan.utils.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private MailService mailService;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AccountService accountService;


    @PostMapping("/login-admin")
    public ResponseEntity<?> loginAdmin(@RequestBody AuthRequest authRequest){
        try{
            return null;
        }catch (Exception e){
            return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (Exception e) {
            return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }
        Account account = accountRepository.findByUsername(authRequest.getUsername());
        if (account == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        if (!account.getIsEnable()) {
            return new ResponseEntity<>("Account is disabled", HttpStatus.FORBIDDEN);
        }
        if (!account.getIsVerify()) {
            return new ResponseEntity<>("Account is not verified", HttpStatus.FORBIDDEN);
        }
        if (account.getIsDelete()) {
            return new ResponseEntity<>("Account is deleted", HttpStatus.FORBIDDEN);
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());
        return new ResponseEntity<>(jwt, HttpStatus.OK);
    }

    @PostMapping("/login/employee")
    public ResponseEntity<?> employeeLogin(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (Exception e) {
            return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }
        Account account = accountRepository.findByUsername(authRequest.getUsername());
        if (account == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        if (!account.getIsEnable()) {
            return new ResponseEntity<>("Account is disabled", HttpStatus.FORBIDDEN);
        }
        if (!account.getIsVerify()) {
            return new ResponseEntity<>("Account is not verified", HttpStatus.FORBIDDEN);
        }
        if (account.getIsDelete()) {
            return new ResponseEntity<>("Account is deleted", HttpStatus.FORBIDDEN);
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());
        return new ResponseEntity<>(jwt, HttpStatus.OK);
    }

    @GetMapping("/getInfoUser")
    public ResponseEntity<?> getInfoUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                String username = userDetails.getUsername();
                Customer customer = customerService.getCustomerByEmail(username);
                if (customer == null) {
                    return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
                }
                return new ResponseEntity<>(customer, HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.OK);
        } catch (Exception e) {
            e.getMessage();
            return new ResponseEntity<>("Invalid token", HttpStatus.UNAUTHORIZED);
        }
    }

    @Transactional
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody RegisterRequest request)  {
        String username = request.getEmail();
        if (!username.matches("^[\\w\\.-]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            return new ResponseEntity<>("Invalid email format", HttpStatus.BAD_REQUEST);
        }
        if (accountRepository.findByUsername(username) != null) {
            return new ResponseEntity<>("Email already exists", HttpStatus.CONFLICT);
        }
        Account account = new Account();
        Customer customer = new Customer();
        account.setUsername(username);
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setIsEnable(true);
        account.setIsDelete(false);
        account.setIsVerify(false);
        account.setRole("USER");
        account.setLoginType("NORMAL");
        Account newAccount = accountRepository.save(account);
        customer.setAccount(newAccount);
        customer.setEmail(newAccount.getUsername());
        customer.setFullName(request.getFullName());
        customer.setPhoneNumber(request.getPhoneNumber());
        customerRepository.save(customer);
        String token = verificationService.createVerificationTokenForUser(account);
        mailService.sendVerificationEmail(username, token);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Xac thuc email sau khi dang ki
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmRegistration(@RequestParam("token") String token) {
        try {
            if (!verificationService.validateVerificationToken(token)) {
                return ResponseEntity.badRequest().body("❌ Hết hạn thời gian xác thực");
            }

            VerificationToken verificationToken = verificationTokenRepository.findByToken(token);
            if (verificationToken == null) {
                return ResponseEntity.badRequest().body("❌ Token không tồn tại");
            }

            Account user = verificationToken.getUser();
            if (user == null) {
                return ResponseEntity.badRequest().body("❌ Không tìm thấy tài khoản liên kết với token");
            }

            if (Boolean.TRUE.equals(user.getIsVerify())) {
                return ResponseEntity.badRequest().body("⚠️ Tài khoản đã được xác thực trước đó");
            }

            user.setIsVerify(true);
            accountRepository.save(user);
            verificationTokenRepository.delete(verificationToken);

            String successPage = """
                    <html>
                        <head>
                            <meta charset="UTF-8">
                            <title>Xác thực thành công</title>
                            <style>
                                body {
                                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                    background-color: #f4f4f4;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    height: 100vh;
                                    margin: 0;
                                }
                                .container {
                                    background-color: white;
                                    padding: 40px;
                                    border-radius: 12px;
                                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                                    text-align: center;
                                }
                                h2 {
                                    color: #28a745;
                                }
                                a.button {
                                    margin-top: 20px;
                                    display: inline-block;
                                    padding: 12px 24px;
                                    background-color: #28a745;
                                    color: white;
                                    text-decoration: none;
                                    border-radius: 8px;
                                    font-weight: bold;
                                    transition: background-color 0.3s;
                                }
                                a.button:hover {
                                    background-color: #218838;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h2>✅ Xác thực email thành công!</h2>
                                <p>Bạn có thể đăng nhập bằng cách nhấn nút bên dưới.</p>
                                <a href="http://localhost:5173/login" class="button">Đăng nhập</a>
                            </div>
                        </body>
                    </html>
                    """;


            return ResponseEntity.ok().header("Content-Type", "text/html").body(successPage);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Lỗi xác thực email: " + e.getMessage());
        }
    }


    // Xac thuc email
    @PostMapping("/resend-verify-email")
    public ResponseEntity<?> resendVerificationToken(@RequestParam("email") String email) {
        try {
            Account account = accountRepository.findByUsername(email);
            if (account == null) {
                return ResponseEntity.badRequest().body("Không tìm thấy tài khoản");
            }

            if (account.getIsVerify()) {
                return ResponseEntity.badRequest().body("Tài khoản đã được xác thực");
            }

            VerificationToken oldToken = verificationTokenRepository.findByUser(account);
            if (oldToken != null) {
                verificationTokenRepository.delete(oldToken);
            }

            String newToken = verificationService.createVerificationTokenForUser(account);
            mailService.sendVerificationEmail(email, newToken);

            return ResponseEntity.ok("Đã gửi lại email xác thực");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi gửi lại email: " + e.getMessage());
        }
    }

    // reset password
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            Account account = accountRepository.findByUsername(email);
            if (account == null) {
                return ResponseEntity.badRequest().body("Email không tồn tại trong hệ thống");
            }
            VerificationToken verificationToken = verificationTokenRepository.findVerificationTokenByUser(account);
            if (verificationToken != null) {
                verificationTokenRepository.delete(verificationToken);
            }
            // Generate a token for password reset
            String token = verificationService.createVerificationTokenForUser(account);

            // Send the reset password email with the token
            mailService.sendResetPasswordEmail(email, token);

            return ResponseEntity.ok("Email hướng dẫn đặt lại mật khẩu đã được gửi");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi khi xử lý yêu cầu: " + e.getMessage());
        }
    }

    @PostMapping("/save-new-password")
    public ResponseEntity<?> saveNewPassword(@RequestBody SaveNewPasswordRequest request) {
        try {
            VerificationToken verificationToken = verificationTokenRepository.findByToken(request.getToken());
            if (verificationToken == null) {
                return ResponseEntity.badRequest().body("Invalid or expired token");
            }

            Account account = verificationToken.getUser();
            if (account == null) {
                return ResponseEntity.badRequest().body("No account associated with this token");
            }

            account.setPassword(passwordEncoder.encode(request.getNewPassword()));
            accountRepository.save(account);

            verificationTokenRepository.delete(verificationToken);

            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating password: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                String username = userDetails.getUsername();

                accountService.changePassword(username, request.getOldPassword(), request.getNewPassword(), request.getConfirmPassword());
                return ResponseEntity.ok("Password changed successfully");
            }
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error changing password", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}

