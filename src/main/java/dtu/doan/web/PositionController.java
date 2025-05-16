package dtu.doan.web;


import dtu.doan.dto.PositionDTO;
import dtu.doan.service.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
public class PositionController {
    @Autowired
    private PositionService service;


    @GetMapping
    public ResponseEntity<List<PositionDTO>> getAllPositions() {
        return ResponseEntity.ok(service.getAllPositions());
    }
}
