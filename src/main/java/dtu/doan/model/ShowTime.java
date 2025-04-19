package dtu.doan.model;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

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
    private String startTime;
    private String endTime;
    @DateTimeFormat
    private Date date;
    private String status;
    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

}
