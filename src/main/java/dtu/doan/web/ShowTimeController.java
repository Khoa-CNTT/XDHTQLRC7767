package dtu.doan.web;

import dtu.doan.dto.ShowTimeChairDTO;
import dtu.doan.model.Chair;
import dtu.doan.model.ShowTime;
import dtu.doan.service.ShowTimeService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    }
    @GetMapping("/booking/{id}")
    public ResponseEntity<ShowTimeChairDTO> findChairByIDShowTime(@PathVariable(value = "id")Long id){
        ShowTime showTime = showTimeService.findShowTimeByID(id);
        ShowTimeChairDTO respone = showTimeService.convertToDTO(showTime);
        if (respone == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().body(respone);
    }
}