package dtu.doan.service;

import dtu.doan.model.Comment;

import java.util.List;

public interface CommentService {
    List<Comment> getUnapprovedComments();
    void approveComment(Long commentId);
    Comment addComment(Long movieId,  String username, String content);
    void deleteComment(Long commentId);

    List<Comment> getCommentsByMovie(Long movieId);
}