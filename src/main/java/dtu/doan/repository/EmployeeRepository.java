package dtu.doan.repository;

import dtu.doan.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByFullNameContainingAndEmailContainingAndPhoneNumberContaining(String fullName, String email, String phoneNumber);

    @Query("SELECT e FROM Employee e WHERE e.username.username = ?1")
    Optional<Employee> findEmployeeByUsername(String username);
}
