package dtu.doan.service;

import dtu.doan.dto.*;
import dtu.doan.model.ShowTime;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface ShowTimeService {
    List<ShowTime> findAllChairByShowTimeId(String date, Long id, Long id_movies);

    ShowTime findShowTimeByID(Long id);

    List<ShowTime> searchShowTimes(String movieName,
                                   String roomName,
                                   LocalDate date);
     ShowTimeWithChairsDTO getShowTimeWithChairs(Long showTimeId);
     ShowListCreatedResponeDTO create(ShowListDTO showListDTO);
//    ShowListCreatedResponeDTO update(Long id, ShowListDTO showListDTO);
    List<LocalDate> findDistinctDatesByMovieId(Long movieId);
    List<ShowTimeListByLocation> findShowTimesByMovieIdAndDate(Long movieId, LocalDate date);
    List<ShowtimeStatisticsDTO> getShowtimeStatistics();
}
