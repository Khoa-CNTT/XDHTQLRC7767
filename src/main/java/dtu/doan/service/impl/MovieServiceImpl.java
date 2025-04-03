package dtu.doan.service.impl;

import dtu.doan.dto.IMovieDetailDTO;
import dtu.doan.dto.MovieRequestDTO;
import dtu.doan.dto.MovieResponseDTO;
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

import java.util.ArrayList;
import java.util.List;

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

    // UI detail role user
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
        return savedMovieResponse;

    }

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
            List<Genre> genres =  genreRepository.getGenreByMovieId(movie.getId());
            movieResponseDTO.setMovieGenres(genres);

            return movieResponseDTO;
        }
        return null;
    }
}
