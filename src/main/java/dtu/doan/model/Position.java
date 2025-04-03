package dtu.doan.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import jakarta.persistence.*;
@Data
@Entity
@Table(name = "job_position",indexes = {
        @Index(name = "idx_position_name", columnList = "name"),
},uniqueConstraints = {
        @UniqueConstraint(columnNames = "name"),
})
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(columnDefinition = ("varchar(255)"))
    private String name;
    @NotNull
    private Boolean isDelete;
}
