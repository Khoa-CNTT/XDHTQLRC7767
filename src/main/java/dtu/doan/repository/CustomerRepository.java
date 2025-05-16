package dtu.doan.repository;

import dtu.doan.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByEmail(String email);

    Optional<Customer> findById(Long id);

    Customer findByPhoneNumber(String phoneNumber);

    Customer findByFullName(String fullName);

    List<Customer> findByIsDeleteFalse();
    @Query("SELECT SUM(c.id) FROM Customer c WHERE c.isDelete = false")
    Long sumById();
}
