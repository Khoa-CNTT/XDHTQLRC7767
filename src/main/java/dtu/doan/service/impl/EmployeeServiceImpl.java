package dtu.doan.service.impl;

import dtu.doan.model.Employee;
import dtu.doan.repository.EmployeeRepository;
import dtu.doan.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    @Autowired
    private EmployeeRepository repository;

    @Override
    public List<Employee> getAllEmployees(String fullName, String email, String phoneNumber) {
        return repository.findByFullNameContainingAndEmailContainingAndPhoneNumberContaining(
                fullName != null ? fullName : "",
                email != null ? email : "",
                phoneNumber != null ? phoneNumber : ""
        );
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
