package dtu.doan.service.impl;

import dtu.doan.dto.RoomDTO;
import dtu.doan.dto.ShowTimeChairDTO;
import dtu.doan.model.Chair;
import dtu.doan.model.Room;
import dtu.doan.model.ShowTime;
import dtu.doan.repository.ChairRepository;
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
    @Autowired
    private ChairRepository chairRepository;
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

    @Override
    public ShowTimeChairDTO convertToDTO(ShowTime showTime) {
        List<Chair> chairList = chairRepository.findAllChairByShowTimeId(showTime.getId());
        ShowTimeChairDTO dto = new ShowTimeChairDTO();
        dto.setId(showTime.getId());
        dto.setStartTime(showTime.getStartTime());
        dto.setEndTime(showTime.getEndTime());
        dto.setDate(showTime.getDate());
        dto.setStatus(showTime.getStatus());
        dto.setMovie(showTime.getMovie());

        RoomDTO roomDTO = new RoomDTO();
        Room room = showTime.getRoom();
        roomDTO.setId(room.getId());
        roomDTO.setName(room.getName());
        roomDTO.setCapacity(room.getCapacity());
        roomDTO.setType(room.getType());
        roomDTO.setChairList(chairList);
        roomDTO.setStatus(room.getStatus());
        dto.setRoom(roomDTO);

        return dto;
    }
}
