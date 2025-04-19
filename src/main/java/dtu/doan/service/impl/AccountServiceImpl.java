package dtu.doan.service.impl;

import dtu.doan.model.Account;
import dtu.doan.repository.AccountRepository;
import dtu.doan.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public void changePassword(String username, String oldPassword, String newPassword, String confirmPassword) {
        Account account = accountRepository.findByUsername(username);
        if (!passwordEncoder.matches(oldPassword, account.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("New password and confirmation do not match");
        }

        // Update the password
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);

    }
}
