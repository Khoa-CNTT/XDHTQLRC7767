package dtu.doan.service;


import dtu.doan.model.Customer;

import java.util.List;

public interface CustomerService  {
    // Define methods for customer-related operations
    void registerCustomer(String fullName, String email, String password, String phoneNumber);
    void updateCustomerDetails(String customerId, String fullName, String email, String phoneNumber);
    void deleteCustomer(String customerId);
    Customer getCustomerById(String customerId);
    List<Customer> getAllCustomers();

    Customer getCustomerByEmail(String email);
}
