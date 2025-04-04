package dtu.doan.repository;

import dtu.doan.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByEmail(String email);

    Customer findByPhoneNumber(String phoneNumber);

    Customer findByFullName(String fullName);
}
