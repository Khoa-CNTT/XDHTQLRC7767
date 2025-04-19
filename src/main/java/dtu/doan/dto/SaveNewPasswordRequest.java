package dtu.doan.dto;

import lombok.Data;

@Data
public class SaveNewPasswordRequest {
    private String token;
    private String newPassword;
}
