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

import java.util.*;

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
    public RoomDTO createRoomWithSeats(RoomDTO room) {
        int capacity = room.getCapacity();
        List<SeatFormat> seatFormats = new ArrayList<>();

        // Fetch the Cinema and validate
        Cinema cinema = cinemaRepository.findByid(room.getCinemaId());
        if (cinema == null) {
            throw new RuntimeException("Cinema not found with id: " + room.getCinemaId());
        }

        Room room1 = new Room();
        room1.setName(room.getName());
        room1.setType(room.getType());
        room1.setCapacity(capacity);
        room1.setStatus("ACTIVE");
        room1.setCinema(cinema); // Ensure Cinema is set

        // Save Room to generate ID
        Room savedRoom = roomRepository.save(room1);

        for (int i = 1; i <= capacity; i++) {
            SeatFormat seat = new SeatFormat();
            seat.setName(String.valueOf(i));
            seat.setRoom(savedRoom);
            seat.setType(i > capacity - 10 ? "COUPLE" : "STANDARD");
            seatFormats.add(seat);
        }

        // Save seats
        seatFormatRepository.saveAll(seatFormats);
        savedRoom.setSeats(new HashSet<>(seatFormats));

        // Return DTO
        RoomDTO roomDTO = new RoomDTO();
        roomDTO.setStatus(savedRoom.getStatus());
        roomDTO.setName(savedRoom.getName());
        roomDTO.setType(savedRoom.getType());
        roomDTO.setCapacity(savedRoom.getCapacity());
        roomDTO.setCinemaId(savedRoom.getCinema().getName()); // Cinema is now guaranteed to be non-null
        return roomDTO;
    }



    @Transactional
    @Override
    public void updateRoom(Long id, RoomDTO roomDTO) {
        Optional<Room> optionalRoom = roomRepository.findById(id);
        if (!optionalRoom.isPresent()) {
            throw new RuntimeException("Room not found with id: " + id);
        }

        Room room = optionalRoom.get();
        Cinema cinema = cinemaRepository.findByid(roomDTO.getCinemaId());
        if (cinema == null) {
            throw new RuntimeException("Cinema not found with id: " + roomDTO.getCinemaId());
        }

        // Update room details
        room.setName(roomDTO.getName());
        room.setType(roomDTO.getType());
        room.setCinema(cinema);

        // Handle capacity and seat updates
        int newCapacity = roomDTO.getCapacity();
        if (newCapacity != room.getCapacity()) {
            room.setCapacity(newCapacity);

            // Recreate seats based on new capacity
            int cols = 10;
            int rows = (int) Math.ceil((double) newCapacity / cols);
            Set<SeatFormat> newSeatFormats = new HashSet<>();

            // Delete existing seats
            seatFormatRepository.deleteAll(room.getSeats());

            // Create new seats
            for (int i = 0; i < rows; i++) {
                char rowLetter = (char) ('A' + i);
                for (int j = 1; j <= cols; j++) {
                    int currentSeatIndex = i * cols + (j - 1);
                    if (currentSeatIndex >= newCapacity) break;

                    SeatFormat seat = new SeatFormat();
                    seat.setName(rowLetter + String.valueOf(j));
                    seat.setRoom(room);
                    seat.setType(currentSeatIndex >= newCapacity - 10 ? "COUPLE" : "STANDARD");

                    newSeatFormats.add(seat);
                }
            }
            seatFormatRepository.saveAll(newSeatFormats);
            room.setSeats(newSeatFormats);
        }

        roomRepository.save(room);
    }

    @Transactional
    @Override
    public void deleteRoom(Long id) {
        Optional<Room> optionalRoom = roomRepository.findById(id);
        if (!optionalRoom.isPresent()) {
            throw new RuntimeException("Room not found with id: " + id);
        }

        Room room = optionalRoom.get();
        // Delete associated seats
        seatFormatRepository.deleteAll(room.getSeats());
        // Delete the room
        roomRepository.delete(room);
    }
}