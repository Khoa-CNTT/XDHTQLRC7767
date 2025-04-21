package dtu.doan.service;

import dtu.doan.model.Chair;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ChairService  {
    List<Chair> findAllChairByShowTimeId(Long showTimeId);
}
