package dtu.doan.dto;

import lombok.Data;

@Data
public class CommentDto {
    Long id;
    String content;
    Long userId;
    Long movieId;
}
