package dtu.doan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowListCreatedResponeDTO {
    private Long id;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long pricePerShowTime;
    private LocalDate showDate;
    private Long movieId;
    private String movieName;
    private Long roomId;
    private String roomName;
    private String status;
}
