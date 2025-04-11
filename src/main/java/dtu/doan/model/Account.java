package dtu.doan.model;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(indexes = {
        @Index(name = "idx_username", columnList = "username"),
        @Index(name = "idx_password", columnList = "password"),
},uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
})
public class Account {
    @Id
    @Column(columnDefinition = ("varchar(45)"))
    private String username;
    @Column(columnDefinition = ("varchar(255)"))
    private String password;
    private Boolean isDelete;
    private Boolean isEnable;
    private String role;
    private Boolean isVerify;
    private String loginType;
}
