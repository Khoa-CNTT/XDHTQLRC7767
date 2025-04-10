package dtu.doan.service.impl;

import dtu.doan.model.Chair;
import dtu.doan.repository.ChairRepository;
import dtu.doan.service.ChairService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChairServiceImpl implements ChairService {
    @Autowired
    private ChairRepository chairRepository;
    @Override
    public List<Chair> findAllChairByRoomIDAndShowTimeID(Long showTimeId) {
        return chairRepository.findAllChairByRoomIDAndShowTimeID(showTimeId);
    }
}
