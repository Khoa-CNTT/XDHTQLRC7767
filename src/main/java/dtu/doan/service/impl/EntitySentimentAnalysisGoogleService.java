package dtu.doan.service.impl;

import com.google.cloud.language.v1.*;
import dtu.doan.dto.SentimentDTO;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EntitySentimentAnalysisGoogleService {
    public SentimentDTO analyzeSentiment(String text) throws IOException {
        SentimentDTO sentimentResult = new SentimentDTO();
        try (LanguageServiceClient language = LanguageServiceClient.create()) {
            Document doc = Document.newBuilder().setContent(text).setType(Document.Type.PLAIN_TEXT).build();
            Sentiment sentiment = language.analyzeSentiment(doc).getDocumentSentiment();
            sentimentResult.setScore(sentiment.getScore());
            sentimentResult.setMagnitude(sentimentResult.getMagnitude());
            return sentimentResult;
        }
    }
}
