package dtu.doan.service.impl;

import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.neural.rnn.RNNCoreAnnotations;
import edu.stanford.nlp.pipeline.Annotation;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import edu.stanford.nlp.sentiment.SentimentCoreAnnotations;
import edu.stanford.nlp.trees.Tree;
import edu.stanford.nlp.util.CoreMap;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.*;

@Service
public class SentimentAnalysisService {
    private final StanfordCoreNLP pipeline;

    public SentimentAnalysisService()  {
        Properties props = new Properties();
        props.setProperty("annotators", "tokenize,ssplit,pos,lemma,parse,sentiment");
        this.pipeline = new StanfordCoreNLP(props);
    }

    public Map<String, Object> analyzeMovieSentiment(List<String> comments) throws IOException {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> commentSentiments = new ArrayList<>();
        int totalScore = 0;

        for (String comment : comments) {
            int sentimentScore = analyzeSentiment(comment);
            totalScore += sentimentScore;

            Map<String, Object> commentResult = new HashMap<>();
            commentResult.put("comment", comment);
            commentResult.put("sentimentScore", sentimentScore);
            commentResult.put("sentimentLabel", getSentimentLabel(sentimentScore));
            commentSentiments.add(commentResult);
        }

        double averageScore = comments.isEmpty() ? 0 : (double) totalScore / comments.size();
        result.put("overallSentimentScore", averageScore);
        result.put("overallSentimentLabel", getSentimentLabel((int) Math.round(averageScore)));
        result.put("comments", commentSentiments);

        return result;
    }

    private int analyzeSentiment(String text) {
        Annotation annotation = new Annotation(text);
        pipeline.annotate(annotation);

        int sentimentScore = 0;
        int sentenceCount = 0;

        for (CoreMap sentence : annotation.get(CoreAnnotations.SentencesAnnotation.class)) {
            Tree sentimentTree = sentence.get(SentimentCoreAnnotations.SentimentAnnotatedTree.class);
            String sentiment = RNNCoreAnnotations.getPredictedClass(sentimentTree) >= 3 ? "Positive" : "Negative";
            sentimentScore += convertSentimentToScore(sentiment);
            sentenceCount++;
        }

        return sentenceCount == 0 ? 0 : sentimentScore / sentenceCount;
    }

    private int convertSentimentToScore(String sentiment) {
        switch (sentiment) {
            case "Very Negative":
                return 1;
            case "Negative":
                return 2;
            case "Neutral":
                return 3;
            case "Positive":
                return 4;
            case "Very Positive":
                return 5;
            default:
                return 3; // Neutral
        }
    }

    private String getSentimentLabel(int score) {
        if (score <= 1) return "Very Negative";
        if (score == 2) return "Negative";
        if (score == 3) return "Neutral";
        if (score == 4) return "Positive";
        return "Very Positive";
    }
}
