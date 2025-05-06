package dtu.doan.service.impl;

import com.google.cloud.language.v1.AnalyzeEntitySentimentRequest;
import com.google.cloud.language.v1.AnalyzeEntitySentimentResponse;
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.LanguageServiceClient;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EntitySentimentAnalysisGoogleService {
    public AnalyzeEntitySentimentResponse analyzeSentiment(String text) throws IOException {
        try (LanguageServiceClient language = LanguageServiceClient.create()) {
            Document doc = Document.newBuilder().setContent(text).setType(Document.Type.PLAIN_TEXT).build();
            AnalyzeEntitySentimentRequest request = AnalyzeEntitySentimentRequest.newBuilder()
                    .setDocument(doc)
                    .build();
            AnalyzeEntitySentimentResponse response = language.analyzeEntitySentiment(request);
            return response;
        }
    }

}
