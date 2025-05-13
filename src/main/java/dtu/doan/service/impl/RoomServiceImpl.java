package dtu.doan.service.impl;

import dtu.doan.dto.RoomDTO;
import dtu.doan.model.Cinema;
import dtu.doan.model.Room;
import dtu.doan.model.SeatFormat;
import dtu.doan.repository.CinemaRepository;
import dtu.doan.repository.RoomRepository;
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
        int rows = 5;
        int cols = 10;
        Set<SeatFormat> seatFormats = new HashSet<>();
        Cinema cinema = cinemaRepository.findByid(room.getCinemaID());
        Room room1 = new Room();
        for (int i = 0; i < rows; i++) {
            char rowLetter = (char) ('A' + i);
            for (int j = 1; j <= cols; j++) {
                SeatFormat c = new SeatFormat();
                c.setName(rowLetter + String.valueOf(j));
                seatFormats.add(c);
            }
        }
        room1.setName(room.getName());
        room1.setType(room.getType());
        room1.setCapacity(50);
        room1.setStatus("ACTIVE");
        room1.setSeats(seatFormats);
        room1.setCinema(cinema);
         roomRepository.save(room1);
        return null;
    }
}
