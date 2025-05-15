package dtu.doan.service.impl;

import dtu.doan.dto.RoomDTO;
import dtu.doan.model.Cinema;
import dtu.doan.model.Room;
import dtu.doan.model.SeatFormat;
import dtu.doan.repository.CinemaRepository;
import dtu.doan.repository.RoomRepository;
import dtu.doan.repository.SeatFormatRepository;
import dtu.doan.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RoomServiceImpl implements RoomService {
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private CinemaRepository cinemaRepository;
    @Autowired
    private SeatFormatRepository seatFormatRepository;
    @Override
    public List<Room> findAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public List<Room> findAllRoomsByCinema(Long cinemaId) {
        return roomRepository.findRoomsByCinemaId(cinemaId);
    }

    @Transactional
    @Override
    public Void createRoomWithSeats(RoomDTO room) {
        int capacity = room.getCapacity();  // Tổng số ghế
        int cols = 10;                      // Số cột mỗi hàng
        int rows = (int) Math.ceil((double) capacity / cols); // Tính số hàng

        Set<SeatFormat> seatFormats = new HashSet<>();
        Cinema cinema = cinemaRepository.findByid(room.getCinemaID());
        Room room1 = new Room();

        room1.setName(room.getName());
        room1.setType(room.getType());
        room1.setCapacity(capacity);
        room1.setStatus("ACTIVE");
        room1.setCinema(cinema);

        for (int i = 0; i < rows; i++) {
            char rowLetter = (char) ('A' + i);
            for (int j = 1; j <= cols; j++) {
                int currentSeatIndex = i * cols + (j - 1);
                if (currentSeatIndex >= capacity) break;

                SeatFormat c = new SeatFormat();
                c.setName(rowLetter + String.valueOf(j));
                c.setRoom(room1);

                if (currentSeatIndex >= capacity - 10) {
                    c.setType("COUPLE");
                } else {
                    c.setType("STANDARD");
                }

                seatFormats.add(c);
            }
        }
        seatFormatRepository.saveAll(seatFormats);

        room1.setSeats(seatFormats);
        roomRepository.save(room1);
        return null;
    }

}
