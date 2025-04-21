package dtu.doan.service.impl;

import dtu.doan.model.Account;
import dtu.doan.model.Comment;
import dtu.doan.model.Movie;
import dtu.doan.repository.AccountRepository;
import dtu.doan.repository.CommentRepository;
import dtu.doan.repository.MovieRepository;
import dtu.doan.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentRepository repository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private MovieRepository movieRepository;

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
    public Comment addComment(Long movieId, String username, String content) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new RuntimeException("Movie not found"));
        Account user = accountRepository.findByUsername(username);
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setMovie(movie);
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());
        return repository.save(comment);
    }

    @Override
    public void deleteComment(Long commentId) {
        Comment comment = repository.findById(commentId).orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setDeleted(true);
        repository.save(comment);
    }
}