package dtu.doan.service.impl;

import dtu.doan.dto.ChairDTO;
import dtu.doan.dto.ShowListCreatedResponeDTO;
import dtu.doan.dto.ShowListDTO;
import dtu.doan.dto.ShowTimeWithChairsDTO;
import dtu.doan.model.*;
import dtu.doan.repository.ChairRepository;
import dtu.doan.repository.MovieRepository;
import dtu.doan.repository.RoomRepository;
import dtu.doan.repository.ShowTimeRepository;
import dtu.doan.service.ShowTimeService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;
import dtu.doan.model.ShowTime;
import dtu.doan.repository.ShowTimeRepository;
import dtu.doan.service.ShowTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
@Transactional
@Service
public class ShowTimeServiceImpl implements ShowTimeService {
    @Autowired
    private ShowTimeRepository showTimeRepository;
    @Autowired
    private ChairRepository chairRepository;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private RoomRepository roomRepository;

    @Override
    public List<ShowTime> findAllChairByShowTimeId(String date, Long id, Long idMovies) {
        return showTimeRepository.findShowTimeByDateAndCinemaAddress(date, id, idMovies);
    }

    @Override
    public ShowTime findShowTimeByID(Long id) {
        return showTimeRepository.findShowTimeById(id);
    }

    @Override
    public List<ShowTime> searchShowTimes(String movieName, String roomName, Date date) {
        return showTimeRepository.searchShowTimes(movieName,roomName,date);
    }

    @Override
    public ShowTimeWithChairsDTO getShowTimeWithChairs(Long showTimeId) {
        List<Chair> chairList = chairRepository.findAllChairViewByShowTimeId(showTimeId);
        ShowTimeWithChairsDTO showTimeWithChairsDTO = new ShowTimeWithChairsDTO();
        Set<ChairDTO>  chairDTOS = new HashSet<>();
        for (Chair chair : chairList) {
            showTimeWithChairsDTO.setPricePerShowTime(chair.getShowTime().getPricePerShowTime());
            ChairDTO chairDTO = new ChairDTO();
            chairDTO.setId(chair.getId());
            chairDTO.setStatus(chair.getStatus());
            chairDTO.setType(chair.getType());
            chairDTO.setName(chair.getName());
            chairDTOS.add(chairDTO);
        }{
        }

        showTimeWithChairsDTO.setChairs(chairDTOS);
       return showTimeWithChairsDTO;
    }

    @Override
    public ShowListCreatedResponeDTO create(ShowListDTO showListDTO) {
        Movie movie = movieRepository.getById(showListDTO.getMovieId());
        Room room = roomRepository.getById(showListDTO.getRoomId());
        int duration = movie.getDuration();
        LocalTime endTime = showListDTO.getStartTime().plusMinutes(duration);
        List<ShowTime> showTimesCheck = showTimeRepository.findShowTimesByDateAndStartTimeBetween(showListDTO.getShowDate(),showListDTO.getStartTime(),endTime);
        ShowListCreatedResponeDTO result = new ShowListCreatedResponeDTO();
        if(showTimesCheck.size() == 0){
            ShowTime showTime = new ShowTime();
            showTime.setStartTime(showListDTO.getStartTime());
            showTime.setEndTime(endTime);
            showTime.setPricePerShowTime(showListDTO.getPricePerShowTime());
            showTime.setDate(showListDTO.getShowDate());
            showTime.setMovie(movie);
            showTime.setRoom(room);
            showTime.setStatus("ACTIVE");
            int rows = 5;
            int cols = 10;
            List<Chair> chairs = new ArrayList<>();
            ShowTime saveData = showTimeRepository.save(showTime);
            for (int i = 0; i < rows; i++) {
                char rowLetter = (char) ('A' + i);
                for (int j = 1; j <= cols; j++) {
                    Chair c = new Chair();
                    c.setName(rowLetter + String.valueOf(j));
                    c.setStatus("AVAILABLE");
                    chairs.add(c);
                    c.setShowTime(showTime);

                }
            }
            chairRepository.saveAll(chairs);
            result.setStartTime(saveData.getStartTime());
            result.setEndTime(saveData.getEndTime());
            result.setPricePerShowTime(saveData.getPricePerShowTime());
            result.setShowDate(saveData.getDate());
            result.setMovieId(saveData.getMovie().getId());
            result.setRoomId(saveData.getRoom().getId());
            result.setMovieName(saveData.getMovie().getName()); // nếu có field này trong DTO
            result.setRoomName(saveData.getRoom().getName());     // nếu có field này trong DTO
            result.setStatus(saveData.getStatus());
            return result;
        }else{
            return null;
        }
    }


}
