package dtu.doan.dto;

public interface IMovieDetailDTO {
    Long getId();

    String getName();

    String getDescription();

    String getImageUrl();

    String getDirector();

    String getActor();

    Integer getDuration();

    Integer getReleaseYear();

    Double getAvgRating();

    String getMovieGenres();
}
