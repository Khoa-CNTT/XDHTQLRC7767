package dtu.doan.dto;

import lombok.Data;

@Data
public class QRTicketDTO {
    private Long id;
    private String nameMovie;
    private String startTime;
    private String chairs;
    private String customerName;
    private Boolean isUsed;
}
