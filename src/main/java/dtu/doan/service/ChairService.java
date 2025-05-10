package dtu.doan.service;

import dtu.doan.model.Chair;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface ChairService  {
    List<Chair> findAllChairByShowTimeId(Long showTimeId);
    Optional<Chair> findChairById(Long id);
    public void updateStatus(Long chairId, String newStatus);
}
