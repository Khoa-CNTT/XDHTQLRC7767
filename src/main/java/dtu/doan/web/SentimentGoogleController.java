package dtu.doan.web;

import com.google.cloud.language.v1.AnalyzeEntitySentimentResponse;
import dtu.doan.service.impl.EntitySentimentAnalysisGoogleService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public String analyze(@RequestParam String text) throws IOException {
        AnalyzeEntitySentimentResponse response = service.analyzeSentiment(text);
        StringBuilder result = new StringBuilder();
        for (EntitySentiment entity : response.getEntitiesSentimentList()) {
            result.append(String.format("Entity: %s<br>", entity.getName()));
            result.append(String.format("  Sentiment score: %f<br>", entity.getSentiment().getScore()));
            result.append(String.format("  Sentiment magnitude: %f<br>", entity.getSentiment().getMagnitude()));
            result.append("<br>-------------------------<br>");
        }
        return result.toString();
    }
}
