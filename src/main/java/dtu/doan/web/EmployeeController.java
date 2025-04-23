package dtu.doan.web;


import dtu.doan.dto.RegisterEmployeeRq;
import dtu.doan.model.Account;
import dtu.doan.model.Employee;
import dtu.doan.repository.AccountRepository;
import dtu.doan.service.EmployeeService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmployeeService service;

    @Transactional
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterEmployeeRq request) {

        String username = request.getUsername();
        if (accountRepository.findByUsername(username) != null) {
            return new ResponseEntity<>("Email already exists", HttpStatus.CONFLICT);
        }
        Account account = new Account();
        Employee employee = new Employee();
        account.setUsername(username);
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setIsEnable(true);
        account.setIsDelete(false);
        account.setIsVerify(true);
        account.setRole(request.getRole());
        account.setLoginType("NORMAL");
        Account newAccount = accountRepository.save(account);
        employee.setFullName(request.getFullName());
        employee.setGender(request.getGender());
        employee.setImage(request.getImage());
        employee.setBirthday(request.getBirthday());
        employee.setEmail(request.getEmail());
        employee.setIsActivated(true);
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setAddress(request.getAddress());
        employee.setCardId(request.getCardId());
        employee.setPosition(request.getPosition());
        employee.setIsDelete(false);
        employee.setUsername(newAccount);
        employee.setDepartment(request.getDepartment());
        service.saveEmployee(employee);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) String fullName) {
        List<Employee> employees = service.getAllEmployees(fullName, email, phoneNumber);
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = service.getEmployeeById(id);
        if (employee.isPresent()) {
            return new ResponseEntity<>(employee.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Employee not found", HttpStatus.NOT_FOUND);
        }
    }

    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody RegisterEmployeeRq request) {
        Optional<Employee> existingEmployee = service.getEmployeeById(id);
        if (existingEmployee.isPresent()) {
            Employee employee = existingEmployee.get();
            employee.setFullName(request.getFullName());
            employee.setGender(request.getGender());
            employee.setImage(request.getImage());
            employee.setBirthday(request.getBirthday());
            employee.setEmail(request.getEmail());
            employee.setPhoneNumber(request.getPhoneNumber());
            employee.setAddress(request.getAddress());
            employee.setCardId(request.getCardId());
            employee.setPosition(request.getPosition());
            employee.setDepartment(request.getDepartment());

            service.saveEmployee(employee);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Employee not found", HttpStatus.NOT_FOUND);
        }
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        Optional<Employee> existingEmployee = service.getEmployeeById(id);
        if (existingEmployee.isPresent()) {
            Employee employee = existingEmployee.get();
            employee.setIsDelete(true);
            service.saveEmployee(employee);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Employee not found", HttpStatus.NOT_FOUND);
        }
    }


}
