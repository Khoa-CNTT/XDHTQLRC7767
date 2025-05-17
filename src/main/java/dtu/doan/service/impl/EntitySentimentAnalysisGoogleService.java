package dtu.doan.service.impl;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.LanguageServiceSettings;
import com.google.cloud.language.v1.Sentiment;
import dtu.doan.dto.SentimentDTO;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;

@Service
public class EntitySentimentAnalysisGoogleService {
    //    public SentimentDTO analyzeSentiment(String text) throws IOException {
//        SentimentDTO sentimentResult = new SentimentDTO();
//        try (LanguageServiceClient language = LanguageServiceClient.create()) {
//            Document doc = Document.newBuilder().setContent(text).setType(Document.Type.PLAIN_TEXT).build();
//            Sentiment sentiment = language.analyzeSentiment(doc).getDocumentSentiment();
//            sentimentResult.setScore(sentiment.getScore());
//            sentimentResult.setMagnitude(sentimentResult.getMagnitude());
//            return sentimentResult;
//        }
//    }
//    @
//    @Value("${spring.gcp.credentials.location}")
//    private  String pathKey;
    private LanguageServiceClient languageServiceClient;

    public EntitySentimentAnalysisGoogleService(@Value("${spring.gcp.credentials.location}") String credentialsPath) throws IOException {
//        String credentialsPath = pathKey;
//        GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream(credentialsPath));
//        LanguageServiceSettings settings = LanguageServiceSettings.newBuilder()
//                .setCredentialsProvider(() -> credentials)
//                .build();
//        languageServiceClient = LanguageServiceClient.create(settings);
        GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream(credentialsPath));
        LanguageServiceSettings settings = LanguageServiceSettings.newBuilder()
                .setCredentialsProvider(() -> credentials)
                .build();
        this.languageServiceClient = LanguageServiceClient.create(settings);
    }

    public SentimentDTO analyzeSentiment(String text) throws IOException {
        SentimentDTO sentimentResult = new SentimentDTO();
        Document doc = Document.newBuilder().setContent(text).setType(Document.Type.PLAIN_TEXT).build();
        Sentiment sentiment = languageServiceClient.analyzeSentiment(doc).getDocumentSentiment();
        sentimentResult.setScore(sentiment.getScore());
        sentimentResult.setMagnitude(sentiment.getMagnitude()); // Gán đúng giá trị magnitude
        return sentimentResult;
    }

    // Phương thức để đóng LanguageServiceClient khi bean bị hủy (tùy chọn)
    @PreDestroy
    public void closeLanguageServiceClient() throws Exception {
        if (languageServiceClient != null) {
            languageServiceClient.close();
        }
    }
}
