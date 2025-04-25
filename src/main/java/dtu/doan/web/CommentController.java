package dtu.doan.web;

import dtu.doan.model.Comment;
import dtu.doan.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    // Add a new comment
    @PostMapping
    public ResponseEntity<?> addComment(@RequestParam Long movieId, @RequestParam String username, @RequestParam String content) {
        try {
            Comment comment = commentService.addComment(movieId, username, content);
            return new ResponseEntity<>(comment, HttpStatus.CREATED);

        }catch (Exception e){
            return new ResponseEntity<>("Error adding comment: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all approved comments for a movie
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Comment>> getCommentsByMovie(@PathVariable Long movieId) {
        try {
            List<Comment> comments = commentService.getCommentsByMovie(movieId);
            return new ResponseEntity<>(comments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get all unapproved comments (admin functionality)
    @GetMapping("/unapproved")
    public ResponseEntity<List<Comment>> getUnapprovedComments() {
        List<Comment> comments = commentService.getUnapprovedComments();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }


    // Approve a comment (admin functionality)
    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveComment(@PathVariable Long id) {
        try {
            commentService.approveComment(id);
            return new ResponseEntity<>("Comment approved successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error approving comment: " + e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}