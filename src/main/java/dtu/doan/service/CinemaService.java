package dtu.doan.service;

import dtu.doan.model.Cinema;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CinemaService {
    Page<Cinema> pageCinemas(String location,Pageable pageable);
    Cinema findById(String id);
    List<Cinema> cinemas();
}
