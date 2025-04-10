package dtu.doan.service;


import dtu.doan.dto.*;
import dtu.doan.model.Movie;

import java.util.List;

public interface MovieService {
    List<Movie> getMovieList(String name, String director, String actor, String genreName);

    IMovieDetailDTO getMovieById(Long id);

    MovieResponseDTO saveMovie(MovieRequestDTO movie);

    void deleteMovie(Long id);

    MovieResponseDTO getMovieDtl(Long id);
    IMovieBookingDTO getMovieByIDToBookTicket(Long id);
}
