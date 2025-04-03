package dtu.doan.model;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(indexes = {
        @Index(name = "idx_name", columnList = "name"),
        @Index(name = "idx_address", columnList = "address"),
},uniqueConstraints = {
        @UniqueConstraint(columnNames = "name"),
})
public class Cinema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
    private String phone;
    private String email;
    private String imageUrl;
    private boolean isDelete;
}
