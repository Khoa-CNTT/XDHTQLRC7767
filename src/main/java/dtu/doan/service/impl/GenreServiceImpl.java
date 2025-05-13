package dtu.doan.service.impl;

import dtu.doan.dto.GenreDTO;
import dtu.doan.model.Genre;
import dtu.doan.repository.GenreRepository;
import dtu.doan.service.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GenreServiceImpl implements GenreService {

    @Autowired
    private GenreRepository repository;
    @Override
    public List<GenreDTO> getAllGenres() {
        return repository.findByIsDeleteFalse().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private GenreDTO convertToDTO(Genre genre) {
        GenreDTO dto = new GenreDTO();
        dto.setId(genre.getId());
        dto.setName(genre.getName());
        return dto;
    }
}
