package dtu.doan.repository;

import dtu.doan.model.SeatFormat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface SeatFormatRepository extends JpaRepository<SeatFormat, Long> {
    List<SeatFormat> findByRoomId(Long roomId);
    List<SeatFormat> findByRoomIdAndType(Long roomId, String type);
    List<SeatFormat> findByRoomIdAndName(Long roomId, String name);
}
