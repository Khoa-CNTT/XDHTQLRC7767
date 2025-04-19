package dtu.doan.repository;

import dtu.doan.model.Cinema;
import dtu.doan.model.Promotion;
import dtu.doan.model.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CinemaRepository extends JpaRepository<Cinema, Long> {
    @Query("SELECT a FROM Cinema a WHERE a.address LIKE %:location%")
    Page<Cinema> cinemas(@Param("location") String location, Pageable pageable);
    @Query("select r from Cinema r where r.id = :id")
    Cinema findByid(@Param("id") String id);
    @Query("SELECT DISTINCT c FROM ShowTime st " +
            "JOIN st.room r " +
            "JOIN r.cinema c " +
            "WHERE st.movie.id = :movieId")
    List<Cinema> findCinemasByMovieId(@Param("movieId") Long movieId);
}
