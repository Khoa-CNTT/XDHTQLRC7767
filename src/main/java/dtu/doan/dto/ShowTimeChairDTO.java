package dtu.doan.dto;

import dtu.doan.model.Chair;
import dtu.doan.model.Movie;
import dtu.doan.model.Room;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowTimeChairDTO {
    Long id;
    private String startTime;
    private String endTime;
    private Date date;
    private String status;
    private Movie movie;
    private RoomDTO room;

}
