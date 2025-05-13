package dtu.doan.repository;

import dtu.doan.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {
    @Query(
            value = "SELECT g.id, g.name, g.is_delete  FROM genre g " +
                    "JOIN movie_genre mg ON g.id = mg.genre_id " +
                    "JOIN movie m ON mg.movie_id = m.id " +
                    "WHERE m.id = ?1",
            nativeQuery = true
    )
    List<Genre> getGenreByMovieId(Long movieId);

    List<Genre> findByIsDeleteFalse();
}
