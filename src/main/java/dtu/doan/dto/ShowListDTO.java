package dtu.doan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShowListDTO {
    private Long movieId;
    private Long roomId;
    private LocalDate showDate;
    private LocalTime startTime;
    private LocalTime endTime;
}
