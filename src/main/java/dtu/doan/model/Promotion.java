package dtu.doan.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import jakarta.persistence.*;
@Data
@Entity
@Table(indexes = {
        @Index(name = "idx_title", columnList = "title"),
        @Index(name = "idx_name", columnList = "name"),
}, uniqueConstraints = {
        @UniqueConstraint(columnNames = "title"),})
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Column(columnDefinition = ("varchar(255)"))
    private String title;

    @NotNull
    @Column(columnDefinition = ("varchar(255)"))
    private String image;

    @NotNull
    @Column(columnDefinition = ("text"))
    private String description;

    @NotNull
    @Column(columnDefinition = ("varchar(255)"))
    private String name;

    @Column(columnDefinition = ("varchar(255)"))
    private String time;

    @NotNull
    @Column(columnDefinition = ("text"))
    private String content;

    @NotNull
    @Column(columnDefinition = ("varchar(255)"))
    private String location;

    @NotNull
    @Column(columnDefinition = ("text"), name = "condition_promotion")
    private String conditionPromotion;

    private Boolean isDelete;

}
