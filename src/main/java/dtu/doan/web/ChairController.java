package dtu.doan.web;


import dtu.doan.model.Chair;
import dtu.doan.service.ChairService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chairs")
public class ChairController {
    @Autowired
    private ChairService chairService;
    @GetMapping("/{id}")
    public ResponseEntity<List<Chair>> findChairByIDShowTime(@PathVariable(value = "id")Long id){
        List<Chair> chairListByIdShowTime = chairService.findAllChairByRoomIDAndShowTimeID(id);
        if (chairListByIdShowTime == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().body(chairListByIdShowTime);
    }
}
