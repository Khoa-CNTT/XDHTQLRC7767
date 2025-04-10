package dtu.doan.dto;

import lombok.Data;

@Data
public class MovieBookingDTO {
    private String name;
    private String description;
    private String imageUrl;
    private int duration;
    private int releaseYear;
    private double rating;
}
