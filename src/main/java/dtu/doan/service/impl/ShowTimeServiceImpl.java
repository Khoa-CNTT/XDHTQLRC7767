package dtu.doan.service.impl;

import dtu.doan.dto.*;
import dtu.doan.model.*;
import dtu.doan.repository.ChairRepository;
import dtu.doan.repository.MovieRepository;
import dtu.doan.repository.RoomRepository;
import dtu.doan.repository.ShowTimeRepository;
import dtu.doan.service.ShowTimeService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import dtu.doan.model.ShowTime;

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
    public List<ShowTime> searchShowTimes(String movieName, String roomName, LocalDate date) {
        return showTimeRepository.searchShowTimes(movieName,roomName,date);
    }

    @Override
    public ShowTimeWithChairsDTO getShowTimeWithChairs(Long showTimeId) {
        List<Chair> chairList = chairRepository.findAllChairViewByShowTimeId(showTimeId);
        ShowTimeWithChairsDTO showTimeWithChairsDTO = new ShowTimeWithChairsDTO();
        List<ChairDTO> chairDTOS = new ArrayList<>();

        for (Chair chair : chairList) {
            showTimeWithChairsDTO.setPricePerShowTime(chair.getShowTime().getPricePerShowTime());

            ChairDTO chairDTO = new ChairDTO();
            chairDTO.setId(chair.getId());
            chairDTO.setStatus(chair.getStatus());
            chairDTO.setType(chair.getType());
            chairDTO.setName(chair.getName());

            chairDTOS.add(chairDTO);
        }

        // Sắp xếp danh sách ghế theo tên ghế (A1, A2, B1, ...)
        chairDTOS.sort(Comparator.comparingInt(c -> Integer.parseInt(c.getName())));

        showTimeWithChairsDTO.setChairs(new LinkedHashSet<>(chairDTOS)); // preserve order if using Set
        return showTimeWithChairsDTO;
    }

    @Override
    public ShowListCreatedResponeDTO create(ShowListDTO showListDTO) {
        Movie movie = movieRepository.getById(showListDTO.getMovieId());
        Room room = roomRepository.getById(showListDTO.getRoomId());

        if (showListDTO.getStartTime() == null) {
            throw new IllegalArgumentException("Start time must not be null");
        }

        int duration = movie.getDuration();
        LocalTime endTime = showListDTO.getStartTime().plusMinutes(duration);
        List<ShowTime> showTimesCheck = showTimeRepository.findConflictingShowTimesAcrossCinemaAndRoom(
                showListDTO.getShowDate(),
                showListDTO.getStartTime(),
                endTime,
                room.getCinema().getId(),
                room.getId()
        );

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

            // Lấy danh sách SeatFormat từ Room
            List<SeatFormat> seatFormats = new ArrayList<>(room.getSeats()); // ✅ chuyển Set → List

            List<Chair> chairs = new ArrayList<>();
            ShowTime savedShowTime = showTimeRepository.save(showTime);

            // Tạo danh sách Chair dựa trên SeatFormat
            for (SeatFormat seatFormat : seatFormats) {
                Chair chair = new Chair();
                chair.setName(seatFormat.getName());
                chair.setStatus("AVAILABLE");
                chair.setShowTime(savedShowTime);
                chair.setType(seatFormat.getType());
                chairs.add(chair);
            }
            chairRepository.saveAll(chairs);


            // Trả kết quả về
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
    @Override
    public List<LocalDate> findDistinctDatesByMovieId(Long movieId) {
        return showTimeRepository.findTop5UpcomingDatesByMovieId(movieId, PageRequest.of(0, 5));
    }

    @Override
    public List<ShowTimeListByLocation> findShowTimesByMovieIdAndDate(Long movieId, LocalDate date) {
        List<ShowTime> showTimes = showTimeRepository.findShowTimesByMovieIdAndDate(movieId, date);
        Map<Long, ShowTimeListByLocation> cinemaMap = new HashMap<>();

        for (ShowTime showTime : showTimes) {
            Cinema cinema = showTime.getRoom().getCinema();
            Long cinemaId = cinema.getId();

            // If cinema is not in the map, add it
            if (!cinemaMap.containsKey(cinemaId)) {
                ShowTimeListByLocation dto = new ShowTimeListByLocation();
                dto.setName(cinema.getName());
                dto.setAddress(cinema.getAddress());
                dto.setShowtimes(new ArrayList<>());
                cinemaMap.put(cinemaId, dto);
            }

            // Add showtime info (id and time) to the DTO
            ShowTimeInfo showTimeInfo = new ShowTimeInfo();
            showTimeInfo.setId(showTime.getId());
            showTimeInfo.setTime(showTime.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")));
            cinemaMap.get(cinemaId).getShowtimes().add(showTimeInfo);
        }

        return new ArrayList<>(cinemaMap.values());
    }

    @Override
    public List<ShowtimeStatisticsDTO> getShowtimeStatistics() {
        List<Object[]> results = showTimeRepository.getAllShowtimeStatistics();
        List<ShowtimeStatisticsDTO> statistics = new ArrayList<>();
        for (Object[] result : results) {
            statistics.add(new ShowtimeStatisticsDTO(
                    (Long) result[0], // showtimeId
                    ((Number) result[1]).longValue(), // ticketsSold
                    ((Number) result[2]).doubleValue() // totalRevenue
            ));
        }
        return statistics;
    }


}
