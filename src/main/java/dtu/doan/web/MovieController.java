package dtu.doan.web;

import dtu.doan.dto.*;
import dtu.doan.model.Movie;
import dtu.doan.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    @Autowired
    private MovieService service;


    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies(@RequestParam(required = false) String name,
                                                    @RequestParam(required = false) String director,
                                                    @RequestParam(required = false) String actor,
                                                    @RequestParam(required = false) String genreName) {
        try {
            List<Movie> movies = service.getMovieList(name, director, actor, genreName);
            if (movies.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(movies, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping
    public ResponseEntity<?> saveMovie(@RequestBody MovieRequestDTO movie) {
        try {
            return new ResponseEntity<>(service.saveMovie(movie), HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteMovie(@PathVariable Long id) {
        service.deleteMovie(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Long id) {
        try{
            IMovieDetailDTO movie = service.getMovieById(id);
            if (movie != null) {
                return new ResponseEntity<>(movie, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/booking/{id}")
    public ResponseEntity<?> getMovieBooking(@PathVariable("id") Long id) {
        IMovieBookingDTO dto = service.getMovieByIDToBookTicket(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }


    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getMovieDtl(@PathVariable Long id) {
        try{
            MovieResponseDTO movie = service.getMovieDtl(id);
            if (movie != null) {
                return new ResponseEntity<>(movie, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("",HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
