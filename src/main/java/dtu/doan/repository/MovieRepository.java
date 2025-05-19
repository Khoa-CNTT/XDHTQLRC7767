package dtu.doan.repository;

import dtu.doan.dto.IMovieBookingDTO;
import dtu.doan.dto.IMovieDetailDTO;
import dtu.doan.dto.MovieStatisticsDTO;
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


    @Query("SELECT DISTINCT m FROM Movie m " +
            "LEFT JOIN m.movieGenres mg " +
            "LEFT JOIN mg.genre g " +
            "WHERE (:title IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :title, '%'))) " +
            "AND (:status IS NULL OR m.status = :status) " +
            "AND (:genre IS NULL OR LOWER(g.name) LIKE LOWER(CONCAT('%', :genre, '%'))) " +
            "AND (:director IS NULL OR LOWER(m.director) LIKE LOWER(CONCAT('%', :director, '%'))) " +
            "AND (:actor IS NULL OR LOWER(m.actor) LIKE LOWER(CONCAT('%', :actor, '%'))) " +
            "AND (:startDate IS NULL OR m.releaseDate >= :startDate) " +
            "AND (:endDate IS NULL OR m.releaseDate <= :endDate)")
    List<Movie> findMoviesWithFilters(
            @Param("title") String title,
            @Param("status") Integer status,
            @Param("genre") String genre,
            @Param("director") String director,
            @Param("actor") String actor,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query(value = """
    SELECT m.name AS movieTitle,
           COUNT(s.id) AS showtimesCount,
           COUNT(c.id) AS ticketsSold,
           SUM(s.price_per_show_time) AS revenue
    FROM movie m
    LEFT JOIN show_time s ON s.movie_id = m.id
    LEFT JOIN chair c ON c.show_time_id = s.id
    WHERE c.status = 'BOOKED'
    GROUP BY m.id, m.name
""", nativeQuery = true)
    List<Object[]> getMovieStatistics();

}
