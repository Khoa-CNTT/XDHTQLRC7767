package dtu.doan.web;

import com.google.cloud.language.v1.AnalyzeEntitySentimentResponse;
import com.google.cloud.language.v1.Entity;
import com.google.cloud.language.v1.Sentiment;
import dtu.doan.dto.SentimentDTO;
import dtu.doan.service.impl.EntitySentimentAnalysisGoogleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/sentiment/google")
public class SentimentGoogleController {
    @Autowired
    private EntitySentimentAnalysisGoogleService service;
    @GetMapping("/analyze-entity-sentiment")
    public ResponseEntity<?> analyze(@RequestParam String text) throws IOException {
        SentimentDTO response = service.analyzeSentiment(text);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
