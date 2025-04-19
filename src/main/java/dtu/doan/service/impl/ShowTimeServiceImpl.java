package dtu.doan.service.impl;

import dtu.doan.model.ShowTime;
import dtu.doan.repository.ShowTimeRepository;
import dtu.doan.service.ShowTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ShowTimeServiceImpl implements ShowTimeService {
    @Autowired
    private ShowTimeRepository showTimeRepository;
    @Override
    public List<ShowTime> findAllChairByShowTimeId(String date, Long id,Long idMovies) {
        return showTimeRepository.findShowTimeByDateAndCinemaAddress(date,id,idMovies);
    }

    @Override
    public ShowTime findShowTimeByID(Long id) {
        return showTimeRepository.findShowTimeById(id);
    }

    @Override
    public List<ShowTime> searchShowTimes(String movieName, String roomName, Date date) {
        return showTimeRepository.searchShowTimes(movieName,roomName,date);
    }
}
