package dtu.doan.service.impl;

import dtu.doan.dto.RoomDTO;
import dtu.doan.model.Cinema;
import dtu.doan.model.Room;
import dtu.doan.model.SeatFormat;
import dtu.doan.repository.CinemaRepository;
import dtu.doan.repository.RoomRepository;
import dtu.doan.repository.SeatFormatRepository;
import dtu.doan.repository.ShowTimeRepository;
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

    @Autowired
    private ShowTimeRepository showTimeRepository;

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
        List<Room> existingRooms = roomRepository.findRoomsByCinemaId(
                Long.valueOf(room.getCinemaId())
        );
        if (existingRooms.stream().anyMatch(r -> r.getName().equals(room.getName()))) {
            throw new RuntimeException("Room with name " + room.getName() + " already exists in this cinema.");
        } else {
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
    }


    @Transactional
    @Override
    public void updateRoom(Long id, RoomDTO roomDTO) {
        if (showTimeRepository.findAllShowtimesInOneRoom(id).size() > 0) {
            throw new RuntimeException("Cannot update room with existing showtimes.");
        }

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));

        Cinema cinema = cinemaRepository.findByid(roomDTO.getCinemaId());
        if (cinema == null) {
            throw new RuntimeException("Cinema not found with id: " + roomDTO.getCinemaId());
        }

        // Update room details
        room.setName(roomDTO.getName());
        room.setType(roomDTO.getType());
        room.setStatus(roomDTO.getStatus());
        room.setCinema(cinema);

        int newCapacity = roomDTO.getCapacity();
        if (newCapacity != room.getCapacity()) {
            // XÓA GHẾ CŨ ĐÚNG CÁCH để Hibernate orphanRemoval hoạt động
            Set<SeatFormat> oldSeats = room.getSeats();
            if (oldSeats != null) {
                oldSeats.clear(); // orphanRemoval sẽ xoá khỏi DB
            }

            // Tạo danh sách ghế mới
            Set<SeatFormat> newSeatFormats = new HashSet<>();
            for (int i = 1; i <= newCapacity; i++) {
                SeatFormat seat = new SeatFormat();
                seat.setName(String.valueOf(i));
                seat.setRoom(room);
                seat.setType(i > newCapacity - 10 ? "COUPLE" : "STANDARD");
                newSeatFormats.add(seat);
            }

            room.setCapacity(newCapacity);
            room.getSeats().addAll(newSeatFormats); // Dùng addAll thay vì set() mới
        }

        roomRepository.save(room); // Hibernate sẽ xử lý mọi thứ
    }



    @Transactional
    @Override
    public void deleteRoom(Long id) {
        if (showTimeRepository.findAllShowtimesInOneRoom(id).size() > 0) {
            throw new RuntimeException("Cannot delete room with existing showtimes.");
        } else {
            Optional<Room> optionalRoom = roomRepository.findById(id);
            if (!optionalRoom.isPresent()) {
                throw new RuntimeException("Room not found with id: " + id);
            }
            Room room = optionalRoom.get();
            // Delete all seats associated with the room
            seatFormatRepository.deleteAll(room.getSeats());
            // Delete the room itself
            roomRepository.delete(room);

        }
    }
}