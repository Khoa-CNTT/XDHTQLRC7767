package dtu.doan.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.Set;

@Data
@Entity
@Table(indexes = {
        @Index(name = "idx_startTime", columnList = "startTime"),
        @Index(name = "idx_endTime", columnList = "endTime"),
        @Index(name = "idx_date", columnList = "date"),
        @Index(name = "idx_status", columnList = "status"),
},uniqueConstraints = {
        @UniqueConstraint(columnNames = {"startTime", "endTime", "date", "room_id"}),
})
public class ShowTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long pricePerShowTime;
    @DateTimeFormat
    private LocalDate date;
    private String status;
    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
    @OneToMany
    @JsonBackReference
    private Set<Chair> chairset;

}
