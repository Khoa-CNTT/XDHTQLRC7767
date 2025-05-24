package dtu.doan.service.impl;

import dtu.doan.dto.*;
import dtu.doan.model.Genre;
import dtu.doan.model.Movie;
import dtu.doan.model.MovieGenre;
import dtu.doan.repository.GenreRepository;
import dtu.doan.repository.MovieGenreRepository;
import dtu.doan.repository.MovieRepository;
import dtu.doan.service.MovieService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class MovieServiceImpl implements MovieService {
    @Autowired
    private MovieRepository repository;
    @Autowired
    private GenreRepository genreRepository;
    @Autowired
    private MovieGenreRepository movieGenreRepository;

    @Override
    public List<Movie> getMovieList(String name, String director, String actor, String genreName) {
        return repository.searchMovies(name, director, actor, genreName);
    }

    @Override
    public IMovieDetailDTO getMovieById(Long id) {
        return repository.getMovieById(id);
    }

    @Transactional
    @Override
    public MovieResponseDTO saveMovie(MovieRequestDTO movie) {
        Movie movieEntity;
        if (movie.getId() != null && repository.existsById(movie.getId())) {
            movieEntity = repository.findById(movie.getId()).orElse(new Movie());
        } else {
            movieEntity = new Movie();
        }
        movieEntity.setName(movie.getName());
        movieEntity.setDirector(movie.getDirector());
        movieEntity.setActor(movie.getActor());
        movieEntity.setDescription(movie.getDescription());
        movieEntity.setReleaseYear(movie.getReleaseYear());
        movieEntity.setDuration(movie.getDuration());
        movieEntity.setRating(movie.getRating());
        movieEntity.setImageUrl(movie.getImageUrl());
        movieEntity.setCountry(movie.getCountry());
        movieEntity.setLanguage(movie.getLanguage());
        movieEntity.setSubtitle(movie.getSubtitle());
        movieEntity.setAgeLimit(movie.getAgeLimit());
        movieEntity.setContent(movie.getContent());
        movieEntity.setDelete(false);
        movieEntity.setBackdrop(movie.getBackdrop());
        movieEntity.setReleaseDate(movie.getReleaseDate());
        movieEntity.setStatus(movie.getStatus());
        Movie savedMovie = repository.save(movieEntity);

        if (movie.getGenreIds() != null && !movie.getGenreIds().isEmpty()) {

            List<MovieGenre> existingMovieGenres = movieGenreRepository.findByMovieId(savedMovie.getId());
            movieGenreRepository.deleteAll(existingMovieGenres);

            List<MovieGenre> newMovieGenres = new ArrayList<>();
            for (Long genreId : movie.getGenreIds()) {
                Genre genre = genreRepository.findById(genreId).orElseThrow(
                        () -> new RuntimeException("Genre not found with ID: " + genreId)
                );
                MovieGenre movieGenre = new MovieGenre();
                movieGenre.setMovie(savedMovie);
                movieGenre.setGenre(genre);
                newMovieGenres.add(movieGenre);
            }
            movieGenreRepository.saveAll(newMovieGenres);
        }

        MovieResponseDTO savedMovieResponse = new MovieResponseDTO();
        savedMovieResponse.setId(savedMovie.getId());
        savedMovieResponse.setName(savedMovie.getName());
        savedMovieResponse.setDirector(savedMovie.getDirector());
        savedMovieResponse.setActor(savedMovie.getActor());
        savedMovieResponse.setDescription(savedMovie.getDescription());
        savedMovieResponse.setReleaseYear(savedMovie.getReleaseYear());
        savedMovieResponse.setDuration(savedMovie.getDuration());
        savedMovieResponse.setRating(savedMovie.getRating());
        savedMovieResponse.setImageUrl(savedMovie.getImageUrl());
        savedMovieResponse.setCountry(savedMovie.getCountry());
        savedMovieResponse.setLanguage(savedMovie.getLanguage());
        savedMovieResponse.setSubtitle(savedMovie.getSubtitle());
        savedMovieResponse.setAgeLimit(savedMovie.getAgeLimit());
        savedMovieResponse.setContent(savedMovie.getContent());
        savedMovieResponse.setMovieGenres(genreRepository.getGenreByMovieId(savedMovie.getId()));
        savedMovieResponse.setBackdrop(savedMovie.getBackdrop());
        savedMovieResponse.setReleaseDate(savedMovie.getReleaseDate());
        savedMovieResponse.setStatus(savedMovie.getStatus());
        return savedMovieResponse;

    }

    @Transactional
    @Override
    public void deleteMovie(Long id) {
        Movie movie = repository.findById(id).orElse(null);
        if (movie != null) {
            movie.setDelete(true);
            repository.save(movie);
        }
    }

    @Override
    public MovieResponseDTO getMovieDtl(Long id) {
        Movie movie = repository.findById(id).orElse(null);
        if (movie != null) {
            MovieResponseDTO movieResponseDTO = new MovieResponseDTO();
            movieResponseDTO.setId(movie.getId());
            movieResponseDTO.setName(movie.getName());
            movieResponseDTO.setDescription(movie.getDescription());
            movieResponseDTO.setImageUrl(movie.getImageUrl());
            movieResponseDTO.setDirector(movie.getDirector());
            movieResponseDTO.setActor(movie.getActor());
            movieResponseDTO.setDuration(movie.getDuration());
            movieResponseDTO.setReleaseYear(movie.getReleaseYear());
            movieResponseDTO.setRating(movie.getRating());
            movieResponseDTO.setCountry(movie.getCountry());
            movieResponseDTO.setLanguage(movie.getLanguage());
            movieResponseDTO.setSubtitle(movie.getSubtitle());
            movieResponseDTO.setAgeLimit(movie.getAgeLimit());
            movieResponseDTO.setContent(movie.getContent());
            movieResponseDTO.setBackdrop(movie.getBackdrop());
            List<Genre> genres =  genreRepository.getGenreByMovieId(movie.getId());
            movieResponseDTO.setMovieGenres(genres);
            movieResponseDTO.setReleaseDate(movie.getReleaseDate());
            movieResponseDTO.setStatus(movie.getStatus());
            String[] actors = movie.getActor() != null ?
                    movie.getActor().split(",\\s*") : new String[0];
            movieResponseDTO.setActors(List.of(actors));

            return movieResponseDTO;
        }
        return null;
    }

    @Override
    public IMovieBookingDTO getMovieByIDToBookTicket(Long id) {
        return repository.getMovieToBookTicket(id);
    }

    @Override
    public List<MovieHomeResponseDTO> getNowShowingMovies() {
        return repository.findByStatusAndIsDeleteFalse(1)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MovieHomeResponseDTO> getUpcomingMovies() {
        return  repository.findByStatusAndIsDeleteFalse(0)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MovieAdminResponseDTO> getListMovieAdmin(MovieFilterDTO filter) {
        List<Movie> movies = repository.findMoviesWithFilters(
                filter.getTitle(),
                filter.getStatus(),
                filter.getGenre(),
                filter.getDirector(),
                filter.getActor(),
                filter.getStartDate(),
                filter.getEndDate()
        );
        return movies.stream()
                .map(this::convertToAdminDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MovieStatisticsDTO> getMovieStatistics() {
        List<Object[]> statistics = repository.getMovieStatistics();
        return statistics.stream()
                .map(row -> new MovieStatisticsDTO(
                        (String) row[0], // movieTitle
                        ((Number) row[1]).intValue(), // showtimesCount
                        ((Number) row[2]).intValue(), // ticketsSold
                        ((Number) row[3]).longValue() // revenue
                ))
                .collect(Collectors.toList());
    }

    private MovieHomeResponseDTO mapToDTO(Movie movie) {
        MovieHomeResponseDTO dto = new MovieHomeResponseDTO();
        dto.setId(movie.getId());
        dto.setTitle(movie.getName());
        dto.setDuration(movie.getDuration() + " PHÚT");
        dto.setReleaseDate(String.valueOf(movie.getReleaseDate()));
        dto.setImage(movie.getImageUrl());
        List<Genre> genres = genreRepository.getGenreByMovieId(movie.getId());
        dto.setGenres(genres);
        return dto;
    }

    private MovieAdminResponseDTO convertToAdminDTO(Movie movie) {
        MovieAdminResponseDTO dto = new MovieAdminResponseDTO();
        dto.setId(movie.getId());
        dto.setName(movie.getName());
        dto.setDescription(movie.getDescription());
        dto.setImageUrl(movie.getImageUrl());
        dto.setDirector(movie.getDirector());
        dto.setActor(movie.getActor());
        dto.setDuration(movie.getDuration());
        dto.setReleaseYear(movie.getReleaseYear());
        dto.setRating(movie.getRating());
        dto.setCountry(movie.getCountry());
        dto.setLanguage(movie.getLanguage());
        dto.setSubtitle(movie.getSubtitle());
        dto.setAgeLimit(movie.getAgeLimit());
        dto.setContent(movie.getContent());
        dto.setDelete(movie.isDelete());
        dto.setReleaseDate(movie.getReleaseDate());
        dto.setStatus(movie.getStatus());
        dto.setBackdrop(movie.getBackdrop());
        List<GenreDTO> genres = genreRepository.getGenreByMovieId(movie.getId())
                .stream()
                .map(genre -> new GenreDTO(genre.getId(), genre.getName()))
                .collect(Collectors.toList());
        dto.setGenres(genres);
        return dto;
    }

}
