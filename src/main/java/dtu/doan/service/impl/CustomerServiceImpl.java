package dtu.doan.service.impl;

import dtu.doan.dto.CustomerDTO;
import dtu.doan.model.Customer;
import dtu.doan.repository.CustomerRepository;
import dtu.doan.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
    public List<CustomerDTO> getAllCustomers() {
        return repository.findByIsDeleteFalse().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Customer getCustomerByEmail(String email) {

        return repository.findByEmail(email);
    }

    @Override
    public CustomerDTO updateCustomer(CustomerDTO customerDTO) {
        Customer customer = repository.findById(customerDTO.getId()).orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.setFullName(customerDTO.getFullName());
        customer.setGender(customerDTO.getGender());
        customer.setEmail(customerDTO.getEmail());
        customer.setPhoneNumber(customerDTO.getPhoneNumber());
        customer.setAddress(customerDTO.getAddress());
        customer.setCardId(customerDTO.getCardId());
        repository.save(customer);
        return convertToDTO(customer);
    }

    @Override
    public void deleteCustomer(Long id) {
        Customer customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.setIsDelete(true);
        repository.save(customer);
    }

    @Override
    public void disableCustomerAccount(Long id) {
        Customer customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.getAccount().setIsEnable(false);
        repository.save(customer);
    }


    private CustomerDTO convertToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setFullName(customer.getFullName());
        dto.setGender(customer.getGender());
        dto.setEmail(customer.getEmail());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setAddress(customer.getAddress());
        dto.setCardId(customer.getCardId());
        dto.setUsername(customer.getAccount().getUsername());
        dto.setIsDelete(customer.getIsDelete());
        dto.setIsEnable(customer.getAccount().getIsEnable());
        return dto;
    }
}
