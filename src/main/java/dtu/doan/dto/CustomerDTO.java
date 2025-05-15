package dtu.doan.dto;

import lombok.Data;

@Data
public class CustomerDTO {
    private Long id;
    private String fullName;
    private Boolean gender;
    private String email;
    private String phoneNumber;
    private String address;
    private String cardId;
    private String username;
    private Boolean isDelete;
    private Boolean isEnable;
}
