package dtu.doan.service;


import dtu.doan.model.Employee;

import java.util.List;
import java.util.Optional;

public interface EmployeeService  {
    public List<Employee> getAllEmployees(String fullName, String email, String phoneNumber);
    Optional<Employee> getEmployeeById(Long id);
    Employee saveEmployee(Employee employee);
}
