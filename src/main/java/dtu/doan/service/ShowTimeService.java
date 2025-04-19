package dtu.doan.service;

import dtu.doan.model.ShowTime;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public interface ShowTimeService {
    List<ShowTime> findAllChairByShowTimeId(String date, Long id, Long id_movies);

    ShowTime findShowTimeByID(Long id);

    List<ShowTime> searchShowTimes(String movieName,
                                   String roomName,
                                   Date date);
}
