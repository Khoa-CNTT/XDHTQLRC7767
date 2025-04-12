package dtu.doan.repository;

import dtu.doan.model.ShowTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ShowTimeRepository extends JpaRepository<ShowTime,Long> {
    @Query("SELECT st FROM ShowTime st " +
            "JOIN st.room r " +
            "JOIN r.cinema c " +
            "JOIN st.movie mv " +
            "WHERE FUNCTION('DATE_FORMAT', st.date, '%d-%m-%Y') = :date " +
            "AND c.id = :id AND mv.id = :idmovies")
    List<ShowTime> findShowTimeByDateAndCinemaAddress(@Param("date") String date,
                                                      @Param("id") Long id,
                                                      @Param("idmovies") Long id_movies);

    @Query("SELECT s FROM ShowTime s WHERE s.id = :id")
    ShowTime findShowTimeById(@Param("id") Long id);

}
