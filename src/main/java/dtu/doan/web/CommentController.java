package dtu.doan.web;

import dtu.doan.dto.CommentDto;
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
    private CommentService service;
    @GetMapping("/test")
    public String test(){
        return "Test comment controller";
    }

    // Add a new comment
    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody CommentDto request) {
        try {
            Comment comment = service.addComment(request.getMovieId(), request.getUserId(), request.getContent());
            return new ResponseEntity<>(comment, HttpStatus.CREATED);
        }catch (Exception e){
            return new ResponseEntity<>("Error adding comment: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all approved comments for a movie
    @GetMapping("/commentByMovieAndUser")
    public ResponseEntity<List<Comment>> getCommentsByMovie(@RequestParam(value = "userId",required = false) Long userId,
                                                            @RequestParam(value = "movieId", required = true) Long movieId) {
        try {
            List<Comment> comments = service.getCommentsByMovie(userId,movieId);
            return new ResponseEntity<>(comments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get all unapproved comments (admin functionality)
    @GetMapping("/unapproved")
    public ResponseEntity<List<Comment>> getUnapprovedComments() {
        List<Comment> comments = service.getUnapprovedComments();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }


    // Approve a comment (admin functionality)
    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveComment(@PathVariable Long id) {
        try {
            service.approveComment(id);
            return new ResponseEntity<>("Comment approved successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error approving comment: " + e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        try {
            service.deleteComment(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Comment not found", HttpStatus.NOT_FOUND);
        }
    }


}
