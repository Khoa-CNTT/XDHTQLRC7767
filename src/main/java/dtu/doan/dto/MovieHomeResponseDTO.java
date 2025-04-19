package dtu.doan.dto;

import lombok.Data;

@Data
public class MovieHomeResponseDTO {
    private Long id;
    private String title;
    private String duration;
    private String releaseDate;
    private String image;
}
