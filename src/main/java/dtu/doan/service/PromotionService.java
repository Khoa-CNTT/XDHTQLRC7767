package dtu.doan.service;

import dtu.doan.model.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface PromotionService {
    Page<Promotion> pagePromotions(String title, Pageable pageable);
}
