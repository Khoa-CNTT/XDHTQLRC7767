package dtu.doan.service.impl;

import dtu.doan.model.Cinema;
import dtu.doan.model.Promotion;
import dtu.doan.repository.CinemaRepository;
import dtu.doan.service.CinemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CinemaServiceImpl implements CinemaService {
    @Autowired
    private CinemaRepository cinemaRepository;
    @Override
    public Page<Cinema> pageCinemas(String location,Pageable pageable) {
        return cinemaRepository.cinemas(location, pageable);
    }

    @Override
    public Cinema findById(String id) {
        return cinemaRepository.findByid(id);
    }

    @Override
    public List<Cinema> cinemas() {
        return cinemaRepository.findAll();
    }

    @Override
    public List<Cinema> cinemasByMovie(Long id) {
        return cinemaRepository.findCinemasByMovieId(id);
    }


}
