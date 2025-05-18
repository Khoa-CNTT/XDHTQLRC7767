package dtu.doan.service;

import dtu.doan.model.Comment;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface CommentService {
    List<Comment> getUnapprovedComments();
    void approveComment(Long commentId);
    Comment addComment(Long movieId,  Long userId, String content) throws IOException;
    void deleteComment(Long commentId);

    List<Comment> getCommentsByMovie(Long userId,Long movieId);

    List<Comment> getCommentsByMovie(Long movieId);

    Map<String, Integer> getSentimentStatisticsByMovie(Long movieId);


}
