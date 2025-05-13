package dtu.doan.service;


import dtu.doan.dto.RoomDTO;
import dtu.doan.model.Room;

import java.util.List;

public interface RoomService  {
    List<Room> findAllRooms();
    List<Room> findAllRoomsByCinema(Long cinemaId);
    Void createRoomWithSeats(RoomDTO room);
}
