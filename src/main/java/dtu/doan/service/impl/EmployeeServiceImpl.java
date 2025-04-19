package dtu.doan.service.impl;

import dtu.doan.model.Employee;
import dtu.doan.repository.EmployeeRepository;
import dtu.doan.service.EmployeeService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    @Autowired
    private EmployeeRepository repository;

    @Override
    public List<Employee> getAllEmployees(String fullName, String email, String phoneNumber) {
        Specification<Employee> spec = Specification.where((root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();
            if (fullName != null && !fullName.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.like(root.get("fullName"), "%" + fullName + "%"));
            }
            if (email != null && !email.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("email"), "%" + email + "%"));
            }
            if (phoneNumber != null && !phoneNumber.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("phoneNumber"), "%" + phoneNumber + "%"));
            }
            return predicate;
        });
        return repository.findAll((Sort) spec);
    }

    @Override
    public Optional<Employee> getEmployeeById(Long id) {
        return repository.findById(id);
    }

    @Override
    public Employee saveEmployee(Employee employee) {
        return repository.save(employee);
    }
}
