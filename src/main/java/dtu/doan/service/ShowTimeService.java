package dtu.doan.service;

import dtu.doan.dto.ShowListCreatedResponeDTO;
import dtu.doan.dto.ShowListDTO;
import dtu.doan.dto.ShowTimeWithChairsDTO;
import dtu.doan.model.Chair;
import dtu.doan.model.ShowTime;
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
     ShowTimeWithChairsDTO getShowTimeWithChairs(Long showTimeId);
     ShowListCreatedResponeDTO create(ShowListDTO showListDTO);
//    ShowListCreatedResponeDTO update(Long id, ShowListDTO showListDTO);
}
