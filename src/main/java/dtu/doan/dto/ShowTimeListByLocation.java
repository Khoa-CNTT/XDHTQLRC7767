package dtu.doan.dto;

import dtu.doan.model.ShowTime;
import lombok.Data;

import java.util.List;

@Data
public class ShowTimeListByLocation {
    private String name;
    private String address;
    private List<ShowTimeInfo> showtimes;
}
