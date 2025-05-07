package dtu.doan.service;

import dtu.doan.model.Comment;

import java.io.IOException;
import java.util.List;

public interface CommentService {
    List<Comment> getUnapprovedComments();
    void approveComment(Long commentId);
    Comment addComment(Long movieId,  Long userId, String content) throws IOException;
    void deleteComment(Long commentId);

    List<Comment> getCommentsByMovie(Long userId,Long movieId);

}
