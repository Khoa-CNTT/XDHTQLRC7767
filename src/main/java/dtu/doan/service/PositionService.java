package dtu.doan.service;

import dtu.doan.dto.PositionDTO;
import dtu.doan.model.Cinema;
import dtu.doan.model.Promotion;
import dtu.doan.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

public interface PositionService  {
    List<PositionDTO> getAllPositions();
}
