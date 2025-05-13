package dtu.doan.web;

import dtu.doan.dto.RoomDTO;
import dtu.doan.model.Room;
import dtu.doan.service.RoomService;
import dtu.doan.service.impl.RoomServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/rooms")
public class RoomController {
    @Autowired
    private RoomServiceImpl roomService;

    @GetMapping()
    public ResponseEntity<List<Room>> rooms(){
        List<Room> rooms = roomService.findAllRooms();
        return new ResponseEntity<>(rooms,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<Room>> roomsByCinemaId(@PathVariable(value = "id")Long id){
        List<Room> rooms = roomService.findAllRoomsByCinema(id);
        return new ResponseEntity<>(rooms,HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody RoomDTO room) {
            roomService.createRoomWithSeats(room);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
