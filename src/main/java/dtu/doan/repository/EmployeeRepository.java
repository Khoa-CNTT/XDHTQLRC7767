package dtu.doan.repository;

import dtu.doan.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByFullNameContainingAndEmailContainingAndPhoneNumberContaining(String fullName, String email, String phoneNumber);
}
