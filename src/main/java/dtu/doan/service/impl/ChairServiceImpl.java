package dtu.doan.service.impl;

import dtu.doan.model.Chair;
import dtu.doan.repository.ChairRepository;
import dtu.doan.service.ChairService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChairServiceImpl implements ChairService {
    @Autowired
    private ChairRepository chairRepository;
    @Override
    public List<Chair> findAllChairByShowTimeId(Long showTimeId) {
        return chairRepository.findAllChairViewByShowTimeId(showTimeId);
    }

    @Override
    public Optional<Chair> findChairById(Long id) {
        return chairRepository.findById(id);
    }

    @Override
    public void updateStatus(Long chairId, String newStatus) {
        chairRepository.updateChairStatus(chairId, newStatus);
    }


}
