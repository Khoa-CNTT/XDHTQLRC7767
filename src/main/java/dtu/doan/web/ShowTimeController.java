package dtu.doan.web;

import dtu.doan.dto.ShowListCreatedResponeDTO;
import dtu.doan.dto.ShowListDTO;
import dtu.doan.dto.ShowTimeListByLocation;
import dtu.doan.dto.ShowTimeWithChairsDTO;
import dtu.doan.model.Chair;
import dtu.doan.model.ShowTime;
import dtu.doan.service.ShowTimeService;
import dtu.doan.model.ShowTime;
import dtu.doan.service.ShowTimeService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/showtime")
public class ShowTimeController {
    @Autowired
    private ShowTimeService showTimeService;

    @GetMapping("")
    public ResponseEntity<List<ShowTime>> getShowTimesByDateAndCinema(@RequestParam(required = false, defaultValue = "") String date,
                                                                      @RequestParam(required = false, defaultValue = "") Long cinema_id,
                                                                      @RequestParam(required = false, defaultValue = "") Long id_movies) {
        List<ShowTime> showTimes = showTimeService.findAllChairByShowTimeId(date, cinema_id, id_movies);
        return new ResponseEntity<>(showTimes, HttpStatus.OK);
    }

    @GetMapping("/search-showtime")
    public ResponseEntity<List<ShowTime>> searchShowtime(@RequestParam(defaultValue = "") String movieName,
                                                         @RequestParam(defaultValue = "") String roomName,
                                                         @RequestParam(defaultValue = "") Date date) {
        List<ShowTime> showTimes = showTimeService.searchShowTimes(movieName,roomName,date);
        return new ResponseEntity<>(showTimes, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ShowTime> getByID(@PathVariable Long id) {
      ShowTime showTime = showTimeService.findShowTimeByID(id);
        return new ResponseEntity<>(showTime, HttpStatus.OK);
    } /**
     * Get a showtime with its room and list of chairs.
     *
     * @param id ID of the showtime
     * @return ShowTimeWithChairsDTO
     */
    @GetMapping("/{id}/with-chairs")
    public ResponseEntity<ShowTimeWithChairsDTO> getShowTimeWithChairs(@PathVariable Long id) {
        ShowTimeWithChairsDTO chairList = showTimeService.getShowTimeWithChairs(id);
        return ResponseEntity.ok(chairList);
    }
    @PostMapping
    public ResponseEntity<ShowListCreatedResponeDTO> createShowTime(@RequestBody ShowListDTO showListDTO) {
        ShowListCreatedResponeDTO response = showTimeService.create(showListDTO);
        if (response == null){
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    // ✅ 6. Lấy các ngày chiếu theo movieId (phục vụ UI tab ngày)
    @GetMapping("/dates/{movieId}")
    public ResponseEntity<List<LocalDate>> getAvailableDatesByMovie(@PathVariable Long movieId) {
        List<LocalDate> dates = showTimeService.findDistinctDatesByMovieId(movieId);
        return ResponseEntity.ok(dates);
    }

    // ✅ 7. Lấy các suất chiếu theo movieId + ngày cụ thể (phục vụ UI theo giờ)
    @GetMapping("/{movieId}/times")
    public ResponseEntity<List<ShowTimeListByLocation>> getShowTimesByMovieAndDate(
            @PathVariable Long movieId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

       List<ShowTimeListByLocation> showTimes = showTimeService.findShowTimesByMovieIdAndDate(movieId, date);
        return ResponseEntity.ok(showTimes);
    }

    }
