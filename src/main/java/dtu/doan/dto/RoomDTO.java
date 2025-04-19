package dtu.doan.dto;

import dtu.doan.model.Chair;
import dtu.doan.model.Cinema;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomDTO {
    private Long id;

    private String name;
    private String type;
    private int capacity;
    private String status;
    private Cinema cinema;
    private List<Chair> chairList;
}
