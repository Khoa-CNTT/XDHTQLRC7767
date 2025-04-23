package dtu.doan.repository;

import dtu.doan.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository  extends JpaRepository<Comment, Long> {
    List<Comment> findByIsApprovedFalseAndIsDeletedFalse(); // Fetch unapproved comments

    List<Comment> findByMovieIdAndIsApprovedTrueAndIsDeletedFalse(Long movieId);

}
