package dtu.doan.web;

import dtu.doan.service.impl.SentimentAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sentiment")
public class SentimentController {

    @Autowired
    private SentimentAnalysisService sentimentAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeMovieSentiment(@RequestBody List<String> comments) {
        try {
            Map<String, Object> result = sentimentAnalysisService.analyzeMovieSentiment(comments);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error analyzing sentiment: " + e.getMessage());
        }
    }
}
