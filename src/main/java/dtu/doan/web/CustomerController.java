package dtu.doan.web;


import dtu.doan.dto.CustomerDTO;
import dtu.doan.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired
    private CustomerService service;

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        return ResponseEntity.ok(service.getAllCustomers());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        try{
            service.deleteCustomer(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception exception){
            return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/disable")
    public ResponseEntity<?> disableCustomerAccount(@PathVariable Long id) {
        try{
            service.disableCustomerAccount(id,false);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception exception){
            return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/enable")
    public ResponseEntity<?> enableCustomerAccount(@PathVariable Long id) {
        try{
            service.disableCustomerAccount(id,true);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception exception){
            return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update-customer")
    public ResponseEntity<?> updateCustomer(@RequestBody CustomerDTO customer) {
        try{
            CustomerDTO customerDTO = service.updateCustomer(customer);
            return new ResponseEntity<>(customerDTO,HttpStatus.OK);
        }catch (Exception exception){
            return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
        }
    }
}
