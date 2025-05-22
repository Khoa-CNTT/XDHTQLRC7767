package dtu.doan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private String name;
    private String type;
    private int capacity;
    private String status;
    private String cinemaId;
}
