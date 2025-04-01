package dtu.doan.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import jakarta.persistence.*;
@Data
@Entity
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(columnDefinition = ("varchar(255)"))
    private String name;
    @NotNull
    private Boolean isDelete;
}
