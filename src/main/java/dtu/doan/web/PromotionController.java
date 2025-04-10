package dtu.doan.web;


import dtu.doan.model.Cinema;
import dtu.doan.model.Promotion;
import dtu.doan.service.CinemaService;
import dtu.doan.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/api/promotion")
public class PromotionController {
    @Autowired
    private PromotionService promotionService;
    @GetMapping("")
    public ResponseEntity<Page<Promotion>> getAllPromotionWithPageAndTitle(@RequestParam(value = "title",defaultValue = "")String title, @RequestParam(defaultValue = "0") int page){
        Pageable pageable = PageRequest.of(page , 5);
        Page<Promotion> pagePromotion = promotionService.pagePromotions(title,pageable);
        if (pagePromotion.getContent() == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().body(pagePromotion);
    }

}
