package dtu.doan.web;

import dtu.doan.model.Account;
import dtu.doan.model.VerificationToken;
import dtu.doan.repository.AccountRepository;
import dtu.doan.repository.VerificationTokenRepository;
import dtu.doan.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/verify")
public class VerificationController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @GetMapping("/confirm")
    public String confirmRegistration(@RequestParam String token) {
        if (!verificationService.validateVerificationToken(token)) {
            return "Invalid or expired token";
        }
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token);
        Account user = verificationToken.getUser();
        user.setIsEnable(true);
        accountRepository.save(user);
        return "User verified successfully";
    }
}