package dtu.doan.repository;

import dtu.doan.model.Chair;
import dtu.doan.model.Ticket;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChairRepository extends JpaRepository<Chair, Long> {
    @Query(value = "SELECT c.* FROM chair c " +
            "INNER JOIN room r ON c.room_id = r.id " +
            "INNER JOIN show_time st ON st.room_id = r.id " +
            "WHERE st.id = ?1", nativeQuery = true)
    List<Chair> findAllChairViewByShowTimeId(Long showTimeId);

    @Modifying
    @Transactional
    @Query("UPDATE Chair c SET c.status = :status WHERE c.id = :id")
    void updateChairStatus(@Param("id") Long id, @Param("status") String status);
}
