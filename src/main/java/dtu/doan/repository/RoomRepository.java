package dtu.doan.repository;

import dtu.doan.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("SELECT r FROM Room r WHERE r.cinema.id = :cinemaId and r.status = 'ACTIVE'")
    List<Room> findRoomsByCinemaId(@Param("cinemaId") Long cinemaId);
}
