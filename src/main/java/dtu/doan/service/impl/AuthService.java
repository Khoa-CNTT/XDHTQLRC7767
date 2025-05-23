package dtu.doan.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import dtu.doan.model.Account;
import dtu.doan.model.Customer;
import dtu.doan.repository.AccountRepository;
import dtu.doan.repository.CustomerRepository;
import dtu.doan.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.Collections;

@Service
public class AuthService {
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;
    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String googleRedirectUri;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtils;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private AccountRepository accountRepository;

    public String generateAuthUrl(String loginType) {
        String url = "";
        loginType = loginType.trim().toLowerCase();
        if ("google".equals(loginType)) {
            GoogleAuthorizationCodeRequestUrl urlBuilder = new GoogleAuthorizationCodeRequestUrl(
                    googleClientId,
                    googleRedirectUri,
                    Arrays.asList("email","profile","openid")
            );
            url = urlBuilder.build();
        }
        return url;

    }
    public String authenticateWithGoogle(String idTokenString) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();
        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            Account account = accountRepository.findByUsername(email);
            if (account == null) {
                account = new Account();
                account.setUsername(email);
                account.setPassword(null);
                account.setIsEnable(true);
                account.setIsDelete(false);
                account.setIsVerify(true);
                account.setRole("USER");
                account.setLoginType("GOOGLE");
                account.setPassword(passwordEncoder.encode("-19992003"));
                account.setIsNonePassword(true);
                accountRepository.save(account);
                Customer customer = new Customer();
                customer.setAccount(account);
                customer.setEmail(email);
                customer.setFullName(name);
                customer.setIsDelete(false);
                customerRepository.save(customer);
            }
            if(account.getIsEnable() == false){
                return null;
            }
            return jwtUtils.generateToken(email);
        } else {
            throw new Exception("Invalid ID token.");
        }
    }
}
