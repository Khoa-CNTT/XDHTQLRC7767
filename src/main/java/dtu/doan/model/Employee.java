package dtu.doan.model;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@Entity
@Table(indexes = {
        @Index(name = "idx_fullName", columnList = "fullName"),
        @Index(name = "idx_email", columnList = "email"),
        @Index(name = "idx_phoneNumber", columnList = "phoneNumber"),
},uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "phoneNumber"),
})
public class Employee {
    @Id
    @Column(columnDefinition = ("varchar(45)"))
    private String id;
    @NotNull
    private String fullName;
    private String image;
    @NotNull
    private Boolean gender;
    @DateTimeFormat()
    @NotNull
    private Date birthday;
    private String email;
    private Boolean isActivated;
    @NotNull
    @Column(columnDefinition = ("varchar(15)"))
    private String phoneNumber;
    @NotNull
    @Column(columnDefinition = ("varchar(255)"))
    private String address;
    @Column(columnDefinition = ("varchar(255)"))
    private String cardId;
    @ManyToOne
    @JoinColumn(name = "position_id")
    @NotNull
    private Position position;
    private Boolean isDelete;
    private String username;
    private String password;
    private String role;

}
