package dtu.doan.repository;

import dtu.doan.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account,String> {
    Account findByUsername(String username);
    @Query("SELECT c.id FROM Customer c WHERE c.account.username = :username")
    Long findCustomerIdByUsername(@Param("username") String username);
}
