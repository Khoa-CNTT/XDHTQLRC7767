package dtu.doan.repository;

import dtu.doan.model.ShowTime;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ShowTimeRepository extends JpaRepository<ShowTime, Long> {


    @Query("SELECT st FROM ShowTime st " +
            "JOIN st.room r " +
            "JOIN r.cinema c " +
            "JOIN st.movie mv " +
            "WHERE FUNCTION('DATE_FORMAT', st.date, '%d-%m-%Y') = :date " +
            "AND c.id = :id " +
            "AND mv.id = :idmovies " +
            "AND st.status = 'ACTIVE'")
    List<ShowTime> findShowTimeByDateAndCinemaAddress(
            @Param("date") String date,
            @Param("id") Long id,
            @Param("idmovies") Long id_movies);


    @Query("SELECT s FROM ShowTime s WHERE s.id = :id")
    ShowTime findShowTimeById(@Param("id") Long id);

    @Query("SELECT s FROM ShowTime s " +
            "WHERE (:movieName IS NULL OR LOWER(s.movie.name) LIKE LOWER(CONCAT('%', :movieName, '%'))) " +
            "AND (:roomName IS NULL OR LOWER(s.room.name) LIKE LOWER(CONCAT('%', :roomName, '%'))) " +
            "AND (:date IS NULL OR s.date = :date)")
    List<ShowTime> searchShowTimes(@Param("movieName") String movieName,
                                   @Param("roomName") String roomName,
                                   @Param("date") LocalDate date);

    List<ShowTime> findByStatus(String status);

    @Query("SELECT s FROM ShowTime s WHERE  " +
            "FUNCTION('TIMESTAMP', s.date, s.endTime) <= CURRENT_TIMESTAMP")
    List<ShowTime> findByStatusAndDateBeforeNow();

    @Query("""
    SELECT s FROM ShowTime s
    WHERE s.date = :date
      AND s.room.cinema.id = :cinemaId
      AND s.room.id = :roomId
      AND s.startTime < :endTime
      AND s.endTime > :startTime
""")
    List<ShowTime> findConflictingShowTimesAcrossCinemaAndRoom(
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("cinemaId") Long cinemaId,
            @Param("roomId") Long roomId
    );

    @Query("""
    SELECT DISTINCT s.date
    FROM ShowTime s
    WHERE s.movie.id = :movieId
      AND s.status = 'ACTIVE'
      AND s.date >= CURRENT_DATE
    ORDER BY s.date ASC
""")
    List<LocalDate> findTop5UpcomingDatesByMovieId(@Param("movieId") Long movieId, Pageable pageable);


    @Query("SELECT s FROM ShowTime s WHERE s.movie.id = :movieId AND s.date = :date AND s.status = 'ACTIVE'")
    List<ShowTime> findShowTimesByMovieIdAndDate(@Param("movieId") Long movieId, @Param("date") LocalDate date);
}
