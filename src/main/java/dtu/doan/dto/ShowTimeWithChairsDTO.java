package dtu.doan.dto;

import dtu.doan.model.Chair;
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
    private Long pricePerShowTime;
    private Set<ChairDTO> chairs;
}
