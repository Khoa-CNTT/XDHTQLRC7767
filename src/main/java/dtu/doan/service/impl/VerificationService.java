package dtu.doan.service.impl;

import dtu.doan.model.VerificationToken;
import dtu.doan.model.Account;
import dtu.doan.repository.VerificationTokenRepository;
import dtu.doan.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

@Service
public class VerificationService {

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private AccountRepository accountRepository;

    public String createVerificationTokenForUser(Account account) {
        String token = UUID.randomUUID().toString();
        VerificationToken myToken = new VerificationToken();
        myToken.setToken(token);
        myToken.setUser(account);
        myToken.setExpiryDate(calculateExpiryDate(24 * 60));
        tokenRepository.save(myToken);
        return token;
    }

    public boolean validateVerificationToken(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token);
        if (verificationToken == null) {
            return false;
        }
        Calendar cal = Calendar.getInstance();
        return verificationToken.getExpiryDate().after(cal.getTime());
    }

    private Date calculateExpiryDate(int expiryTimeInMinutes) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.MINUTE, expiryTimeInMinutes);
        return new Date(cal.getTime().getTime());
    }
}