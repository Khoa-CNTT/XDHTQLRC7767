package dtu.doan.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Objects;

@Data
@Entity
@Table()
public class SeatFormat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
    @Override
    public int hashCode() {
        return Objects.hash(name); // ✅ KHÔNG dùng `room`
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SeatFormat that = (SeatFormat) o;
        return Objects.equals(name, that.name);
    }
}