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
        List<ShowTime> showTimesCheck = showTimeRepository.findShowTimesByDateAndStartTimeBetween(showListDTO.getShowDate(), showListDTO.getStartTime(), endTime);
        ShowListCreatedResponeDTO result = new ShowListCreatedResponeDTO();

        if (showTimesCheck.isEmpty()) {
            ShowTime showTime = new ShowTime();
            showTime.setStartTime(showListDTO.getStartTime());
            showTime.setEndTime(endTime);
            showTime.setPricePerShowTime(showListDTO.getPricePerShowTime());
            showTime.setDate(showListDTO.getShowDate());
            showTime.setMovie(movie);
            showTime.setRoom(room);
            showTime.setStatus("ACTIVE");

            // Lấy danh sách ChairFormat từ Room
            List<SeatFormat> seatFormats = (List<SeatFormat>) room.getSeats(); // Giả sử Room có quan hệ với SeatFormat
            List<Chair> chairs = new ArrayList<>();
            ShowTime savedShowTime = showTimeRepository.save(showTime);

            // Tạo danh sách Chair dựa trên SeatFormat
            for (SeatFormat seatFormat : seatFormats) {
                Chair chair = new Chair();
                chair.setName(seatFormat.getName());
                chair.setStatus("AVAILABLE");
                chair.setShowTime(savedShowTime);
                chairs.add(chair);
            }

            chairRepository.saveAll(chairs);

            result.setStartTime(savedShowTime.getStartTime());
            result.setEndTime(savedShowTime.getEndTime());
            result.setPricePerShowTime(savedShowTime.getPricePerShowTime());
            result.setShowDate(savedShowTime.getDate());
            result.setMovieId(savedShowTime.getMovie().getId());
            result.setRoomId(savedShowTime.getRoom().getId());
            result.setMovieName(savedShowTime.getMovie().getName());
            result.setRoomName(savedShowTime.getRoom().getName());
            result.setStatus(savedShowTime.getStatus());
            return result;
        } else {
            return null;
        }
    }


}
