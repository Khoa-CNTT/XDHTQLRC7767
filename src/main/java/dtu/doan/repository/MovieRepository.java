package dtu.doan.repository;

import dtu.doan.dto.IMovieBookingDTO;
import dtu.doan.dto.IMovieDetailDTO;
import dtu.doan.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    @Query("SELECT m FROM Movie m JOIN m.movieGenres mg JOIN mg.genre g " +
            "WHERE (:name IS NULL OR m.name LIKE %:name%) " +
            "AND (:director IS NULL OR m.director LIKE %:director%) " +
            "AND (:actor IS NULL OR m.actor LIKE %:actor%) " +
            "AND (:genreName IS NULL OR g.name LIKE %:genreName%)")
    List<Movie> searchMovies(@Param("name") String name,
                             @Param("director") String director,
                             @Param("actor") String actor,
                             @Param("genreName") String genreName);

    @Query(value = "select " +
            "mv.id" +
            ",mv.description" +
            ",mv.name" +
            ",mv.image_url as imageUrl" +
            ",mv.director"  +
            ",mv.actor" +
            ",mv.duration" +
            ",mv.release_year as releaseYear" +
            ",GROUP_CONCAT(DISTINCT mtype.name SEPARATOR ', ') as movieGenres" +
            ",mv.rating as rating" +
            ",mv.country" +
            ",mv.language" +
            ",mv.subtitle" +
            ",mv.age_limit as ageLimit" +
            ",mv.content" +
            " from movie as mv " +
            "LEFT JOIN movie_genre matype ON mv.id = matype.movie_id " +
            "LEFT JOIN genre as mtype ON matype.genre_id = mtype.id " +
            "WHERE mv.id = ?1 and mv.is_delete = 0 " +
            "GROUP BY mv.id", nativeQuery = true)
    IMovieDetailDTO getMovieById(Long movieId);


    @Query("SELECT mv.id, mv.name AS name, mv.description AS description, mv.imageUrl AS imageUrl, " +
            "mv.duration AS duration, mv.releaseYear AS releaseYear, mv.rating AS rating " +
            "FROM Movie mv WHERE mv.id = :id AND mv.isDelete = false")
    IMovieBookingDTO getMovieToBookTicket(@Param("id") Long id);

    List<Movie> findByReleaseDateBeforeAndIsDeleteFalse(LocalDate currentDate);
    List<Movie> findByReleaseDateAfterAndIsDeleteFalse(LocalDate currentDate);

    List<Movie> findByStatusAndIsDeleteFalse(int status);


}
