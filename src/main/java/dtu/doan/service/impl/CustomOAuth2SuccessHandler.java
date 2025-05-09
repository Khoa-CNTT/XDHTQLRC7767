package dtu.doan.service.impl;

import dtu.doan.model.Account;
import dtu.doan.model.Customer;
import dtu.doan.repository.AccountRepository;
import dtu.doan.repository.CustomerRepository;
import dtu.doan.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {
    @Autowired
    private JwtUtil jwtUtils;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private AccountRepository accountRepository;
//    @Override
//    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
//        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
//        String email = oAuth2User.getAttribute("email");
//        String fullName = oAuth2User.getAttribute("name");
//        Account account = accountRepository.findByUsername(email);
//        System.out.println("Login thành công với email: " + email);
//        if (account == null) {
//            account = new Account();
//            account.setUsername(email);
//            account.setPassword(null);
//            account.setIsEnable(true);
//            account.setIsDelete(false);
//            account.setIsVerify(true);
//            account.setRole("USER");
//            account.setLoginType("GOOGLE");
//            accountRepository.save(account);
//
//            Customer customer = new Customer();
//            customer.setAccount(account);
//            customer.setEmail(email);
//            customer.setFullName(fullName);
//            customerRepository.save(customer);
//        }
//        String jwt = jwtUtils.generateToken(email);
//        response.sendRedirect("http://localhost:5173/login-success?token=" + jwt);
//
//    }
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
//        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
//        String email = oAuth2User.getAttribute("email");
//        String fullName = oAuth2User.getAttribute("name");
//        System.out.println("Login thành công với email: " + email);
//        Account account = accountRepository.findByUsername(email);
//        if (account == null) {
//            account = new Account();
//            account.setUsername(email);
//            account.setPassword(null);
//            account.setIsEnable(true);
//            account.setIsDelete(false);
//            account.setIsVerify(true);
//            account.setRole("USER");
//            account.setLoginType("GOOGLE");
//            accountRepository.save(account);
//            Customer customer = new Customer();
//            customer.setAccount(account);
//            customer.setEmail(email);
//            customer.setFullName(fullName);
//            customerRepository.save(customer);
//        }
//        String jwt = jwtUtils.generateToken(email);
//        response.sendRedirect("http://localhost:5173/login-success?token=" + jwt);
    }

}
