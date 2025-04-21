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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}