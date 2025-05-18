package dtu.doan.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MovieFilterDTO {
    private String title;
    private Integer status;
    private String genre;
    private String director;
    private String actor;
    private LocalDate startDate;
    private LocalDate endDate;
}
