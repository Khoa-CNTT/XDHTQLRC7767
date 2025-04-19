package dtu.doan.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String password;
    private String email;
    private String phoneNumber;
}


