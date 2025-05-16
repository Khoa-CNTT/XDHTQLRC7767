package dtu.doan.service.impl;

import dtu.doan.dto.PositionDTO;
import dtu.doan.model.Position;
import dtu.doan.repository.PositionRepository;
import dtu.doan.service.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PositionServiceImpl implements PositionService {
    @Autowired
    private PositionRepository repository;

    @Override
    public List<PositionDTO> getAllPositions() {
        return repository.findByIsDeleteFalse().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    private PositionDTO convertToDTO(Position position) {
        PositionDTO dto = new PositionDTO();
        dto.setId(position.getId());
        dto.setName(position.getName());
        return dto;
    }
}
