package dtu.doan.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@Entity
@Table(name = "customer",indexes = {
        @Index(name = "idx_customer_username", columnList = "username"),
        @Index(name = "idx_customer_email", columnList = "email"),
        @Index(name = "idx_customer_cardId", columnList = "cardId")
},uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "cardId")
})
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String fullName;
    private Boolean gender;
    @DateTimeFormat()
    private Date birthday;
    private String email;
    @Column(columnDefinition = ("varchar(15)"))
    private String phoneNumber;
    private String address;
    private String cardId;

    @OneToOne
    @JoinColumn(name = "username")
    private Account account;

    private Boolean isDelete;
}
