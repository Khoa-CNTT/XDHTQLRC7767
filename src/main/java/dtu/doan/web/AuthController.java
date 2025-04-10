package dtu.doan.web;

import dtu.doan.dto.AuthRequest;
import dtu.doan.dto.RegisterRequest;
import dtu.doan.model.Account;
import dtu.doan.model.Customer;
import dtu.doan.model.VerificationToken;
import dtu.doan.repository.AccountRepository;
import dtu.doan.repository.CustomerRepository;
import dtu.doan.repository.VerificationTokenRepository;
import dtu.doan.service.CustomerService;
import dtu.doan.service.impl.VerificationService;
import dtu.doan.service.impl.MailService;
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

//            String jwt = token.substring(7); // Remove "Bearer " prefix
//            String username = jwtUtil.extractUsername(jwt);
//            Account account = accountRepository.findByUsername(username);
//            if (account == null) {
//                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
//            }
            return new ResponseEntity<>(null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Invalid token", HttpStatus.UNAUTHORIZED);
        }
    }

    @Transactional
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody RegisterRequest request) throws Exception {
        String username = request.getEmail();
        if (!username.matches("^[\\w\\.-]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            return new ResponseEntity<>("Invalid email format", HttpStatus.BAD_REQUEST);
        }
        if (accountRepository.findByUsername(username) != null) {
            return new ResponseEntity<>("Username already exists", HttpStatus.CONFLICT);
        }
        Account account = new Account();
        Customer customer = new Customer();
        account.setUsername(username);
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setIsEnable(true);
        account.setIsDelete(false);
        account.setIsVerify(false);
        account.setRole("USER");
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
    @GetMapping("/confirm")
    public ResponseEntity<?> confirmRegistration(@RequestParam("token") String token) {
        if (!verificationService.validateVerificationToken(token)) {
            return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn");
        }
        try {
            VerificationToken verificationToken = verificationTokenRepository.findByToken(token);
            if (verificationToken == null) {
                return ResponseEntity.badRequest().body("Token không tồn tại");
            }
            Account user = verificationToken.getUser();
            if (user.getIsVerify()) {
                return ResponseEntity.badRequest().body("Tài khoản đã được xác thực trước đó");
            }

            user.setIsVerify(true);
            accountRepository.save(user);

            verificationTokenRepository.delete(verificationToken);
            return ResponseEntity.ok("Xác thực email thành công");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi xác thực email: " + e.getMessage());
        }
    }


    // Xac thuc email
    @GetMapping("/resend")
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
            mailService.sendResetPasswordEmail(email);
            return ResponseEntity.ok("Email hướng dẫn đặt lại mật khẩu đã được gửi");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi khi xử lý yêu cầu: " + e.getMessage());
        }
    }
}

