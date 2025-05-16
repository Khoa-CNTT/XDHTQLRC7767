package dtu.doan.service;


import dtu.doan.dto.CustomerDTO;
import dtu.doan.model.Customer;

import java.util.List;

public interface CustomerService  {
    // Define methods for customer-related operations
    void registerCustomer(String fullName, String email, String password, String phoneNumber);
    void updateCustomerDetails(String customerId, String fullName, String email, String phoneNumber);
    void deleteCustomer(String customerId);
    Customer getCustomerById(String customerId);
    List<CustomerDTO> getAllCustomers();

    Customer getCustomerByEmail(String email);

    CustomerDTO updateCustomer(CustomerDTO customerDTO);
    void deleteCustomer(Long id);
    void disableCustomerAccount(Long id,boolean status);
    Long sumById();
}
