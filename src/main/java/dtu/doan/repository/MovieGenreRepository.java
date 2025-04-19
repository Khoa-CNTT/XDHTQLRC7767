package dtu.doan.repository;

import dtu.doan.model.Movie;
import dtu.doan.model.MovieGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface MovieGenreRepository extends JpaRepository<MovieGenre, Long> {
    List<MovieGenre> findByMovieId(Long movieId);

    void deleteByMovie(Movie savedMovie);

}
