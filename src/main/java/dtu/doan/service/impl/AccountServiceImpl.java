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
        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("New password and confirmation do not match");
        }
        Account account = accountRepository.findByUsername(username);
        if (account.getIsNonePassword() == true) {
            account.setPassword(passwordEncoder.encode(newPassword));
            account.setIsNonePassword(false);
            accountRepository.save(account);
            return;
        }
        if (!passwordEncoder.matches(oldPassword, account.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        // Update the password
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);

    }

    @Override
    public Long getCustomerIdByUsername(String username) {
        Long customerId = accountRepository.findCustomerIdByUsername(username);
        if (customerId == null) {
            throw new RuntimeException("Customer not found");
        }
        return customerId;
    }
}
