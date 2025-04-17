package dtu.doan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieBookingDTO {
    private String name;
    private String description;
    private String imageUrl;
    private int duration;
    private int releaseYear;
    private double rating;
}
