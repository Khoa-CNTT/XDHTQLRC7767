package dtu.doan.model;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
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
}
