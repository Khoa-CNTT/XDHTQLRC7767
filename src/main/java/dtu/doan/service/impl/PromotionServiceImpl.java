package dtu.doan.service.impl;

import dtu.doan.model.Promotion;
import dtu.doan.repository.PromotionRepository;
import dtu.doan.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PromotionServiceImpl implements PromotionService {
    @Autowired
    private PromotionRepository promotionRepository;
    @Override
    public Page<Promotion> pagePromotions(String title, Pageable pageable) {
        return promotionRepository.listPromotion(title,pageable);
    }


}
