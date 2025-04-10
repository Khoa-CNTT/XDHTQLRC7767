package dtu.doan.web;

import dtu.doan.model.Cinema;
import dtu.doan.model.Promotion;
import dtu.doan.service.CinemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Schedules;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController()
@RequestMapping("/api/cinema")
public class CinemaController {
    @Autowired
    private CinemaService cinemaService;
    @GetMapping("")
    public ResponseEntity<Page<Cinema>> getAllListWithPage(@RequestParam(value = "location",defaultValue = "")String location, @RequestParam(defaultValue = "0") int page){
        Pageable pageable = PageRequest.of(page , 5);
        Page<Cinema> pageCinema = cinemaService.pageCinemas(location,pageable);
        if (pageCinema.getContent() == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().body(pageCinema);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Cinema> findById(@RequestParam(value = "id") String id){
        Cinema cinema = cinemaService.findById(id);
        if (cinema == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().body(cinema);
    }
    @GetMapping("/list-cinemas")
    public ResponseEntity<List<Cinema>> findAll(){
        List<Cinema> cinemas = cinemaService.cinemas();
        if (cinemas == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().body(cinemas);
    }

}
