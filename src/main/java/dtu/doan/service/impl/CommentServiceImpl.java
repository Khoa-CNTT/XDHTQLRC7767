package dtu.doan.service.impl;

import dtu.doan.dto.SentimentDTO;
import dtu.doan.model.Comment;
import dtu.doan.model.Customer;
import dtu.doan.model.Movie;
import dtu.doan.repository.AccountRepository;
import dtu.doan.repository.CommentRepository;
import dtu.doan.repository.CustomerRepository;
import dtu.doan.repository.MovieRepository;
import dtu.doan.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentRepository repository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private EntitySentimentAnalysisGoogleService analysisGoogleService;

    @Override
    public List<Comment> getUnapprovedComments() {
        return repository.findByIsApprovedFalseAndIsDeletedFalse();

    }

    @Override
    public void approveComment(Long commentId) {
        Comment comment = repository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setApproved(true);
        repository.save(comment);
    }

    @Override
    public Comment addComment(Long movieId, Long userId, String content) throws IOException {
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new RuntimeException("Movie not found"));
        Customer user = customerRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        SentimentDTO sentimentDTO = analysisGoogleService.analyzeSentiment(content);
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setMovie(movie);
        comment.setUser(user);
        comment.setApproved(false);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setSentiment(processSentimentScore(sentimentDTO));
        comment.setScore(sentimentDTO.getScore());
        return repository.save(comment);
    }

    @Override
    public void deleteComment(Long commentId) {
        Comment comment = repository.findById(commentId).orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setDeleted(true);
        repository.save(comment);
    }

    @Override
    public List<Comment> getCommentsByMovie(Long userId,Long movieId) {
        return repository.findAllVisibleComments(userId,movieId);
    }

    @Override
    public List<Comment> getCommentsByMovie(Long movieId) {
        return repository.findByMovieId(movieId);
    }

    @Override
    public Map<String, Integer> getSentimentStatisticsByMovie(Long movieId) {
        List<Comment> comments = repository.findByMovieId(movieId);

        long positiveCount = comments.stream().filter(c -> c.getScore() > 0.5).count();
        long neutralCount = comments.stream().filter(c -> c.getScore() >= 0.0 && c.getScore() <= 0.5).count();
        long negativeCount = comments.stream().filter(c -> c.getScore() < 0.0).count();

        long total = positiveCount + neutralCount + negativeCount;

        if (total == 0) {
            return Map.of("10011003", 0, "10011002", 0, "10011001", 0);
        }

        // Calculate percentages
        int positivePercentage = Math.round((positiveCount * 100.0f) / total);
        int neutralPercentage = Math.round((neutralCount * 100.0f) / total);
        int negativePercentage = 100 - positivePercentage - neutralPercentage; // Ensure total is 100%

        return Map.of(
                "10011003", positivePercentage,
                "10011002", neutralPercentage,
                "10011001", negativePercentage
        );
    }

    public String processSentimentScore(SentimentDTO sentimentDTO) {
        float score = sentimentDTO.getScore();
        if (score < 0.0) {
            return "10011001"; //Negative
        } else if (score >= 0.0 && score <= 0.5) {
            return "10011002"; //Neutral
        } else {
            return "10011003"; //Positive
        }
    }
}
