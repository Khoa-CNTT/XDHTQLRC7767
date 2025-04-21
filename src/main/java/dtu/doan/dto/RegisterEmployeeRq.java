package dtu.doan.dto;


import dtu.doan.model.Position;
import lombok.Data;

import java.util.Date;

@Data
public class RegisterEmployeeRq {
    private String fullName;

    private String image;

    private Boolean gender;

    private Date birthday;

    private String email;

    private String phoneNumber;

    private String address;

    private String cardId;

    private String positionId;

    private String username;

    private String password;

    private String role;
    private Position position;
    private String department;
}