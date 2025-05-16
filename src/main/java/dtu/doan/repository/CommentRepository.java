package dtu.doan.repository;

import dtu.doan.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository  extends JpaRepository<Comment, Long> {
    List<Comment> findByIsApprovedFalseAndIsDeletedFalse(); // Fetch unapproved comments

    List<Comment> findByMovieIdAndIsApprovedTrueAndIsDeletedFalse(Long movieId);

    @Query("SELECT c FROM Comment c " +
            "WHERE c.isDeleted = false " +
            "AND c.movie.id = :movieId " +
            "AND (c.isApproved = true OR c.user.id = :currentUserId) " +
            "ORDER BY c.createdAt DESC")
    List<Comment> findAllVisibleComments(@Param("currentUserId") Long currentUserId,@Param("movieId") Long movieId);

    List<Comment> findByMovieId(Long movieId);

}
