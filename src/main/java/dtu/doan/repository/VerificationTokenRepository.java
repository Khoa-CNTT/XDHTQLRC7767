package dtu.doan.repository;

import dtu.doan.model.VerificationToken;
import dtu.doan.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    VerificationToken findByToken(String token);
    VerificationToken findByUser(Account user);
}