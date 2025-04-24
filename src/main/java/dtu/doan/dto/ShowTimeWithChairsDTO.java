package dtu.doan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowTimeWithChairsDTO {
    private Long id;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long pricePerShowTime;
    private LocalDate date;
    private String status;

    private Long movieId;
    private String movieName;

    private Long roomId;
    private String roomName;

    private List<ChairDTO> chairs;
}
