package dtu.doan.web;

import dtu.doan.model.ShowTime;
import dtu.doan.service.ShowTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/showtime")
public class ShowTimeController {
    @Autowired
    private ShowTimeService showTimeService;

    @GetMapping("")
    public ResponseEntity<List<ShowTime>> getShowTimesByDateAndCinema(@RequestParam(required = false) String date,
                                                                      @RequestParam(required = false) Long cinema_id,
                                                                      @RequestParam(required = false) Long id_movies){
        List<ShowTime> showTimes = showTimeService.findShowTimeByDateAndCinemaAddress(date, cinema_id,id_movies);
        return new ResponseEntity<>(showTimes, HttpStatus.OK);
    }

}