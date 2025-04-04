package dtu.doan.service.impl;

import dtu.doan.model.Customer;
import dtu.doan.repository.CustomerRepository;
import dtu.doan.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    CustomerRepository repository;
    @Override
    public void registerCustomer(String fullName, String email, String password, String phoneNumber) {

    }

    @Override
    public void updateCustomerDetails(String customerId, String fullName, String email, String phoneNumber) {

    }

    @Override
    public void deleteCustomer(String customerId) {

    }

    @Override
    public Customer getCustomerById(String customerId) {
        return null;
    }

    @Override
    public List<Customer> getAllCustomers() {
        return null;
    }

    @Override
    public Customer getCustomerByEmail(String email) {

        return repository.findByEmail(email);
    }
}
