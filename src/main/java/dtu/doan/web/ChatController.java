package dtu.doan.web;

import dtu.doan.model.Movie;
import dtu.doan.repository.MovieRepository;
import dtu.doan.service.impl.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.stream.Collectors;

// dtu.doan.controller.ChatController
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private OpenAiService openAiService;

    @Value("${openai.api.key}")
    private String apiKey;

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody String userQuestion) {
        List<Movie> movies = movieRepository.findAll();

        String movieData = movies.stream().map(movie -> String.format(
                "- Tên phim: %s\n  Mô tả: %s\n  Đạo diễn: %s\n  Diễn viên: %s\n  Năm phát hành: %d\n  Quốc gia: %s\n  Ngôn ngữ: %s\n  Thời lượng: %d phút\n  Độ tuổi: %d+\n  Ngày phát hành: %s\n  Trạng thái: %s\n",
                movie.getName(),
                movie.getDescription(),
                movie.getDirector(),
                movie.getActor(),
                movie.getReleaseYear(),
                movie.getCountry(),
                movie.getLanguage(),
                movie.getDuration(),
                movie.getAgeLimit(),
                movie.getReleaseDate(),
                movie.getStatus() == 1 ? "Đang chiếu" : "Sắp chiếu"
        )).collect(Collectors.joining("\n"));

        String prompt = """
                Bạn là một trợ lý AI, chỉ được phép trả lời các câu hỏi liên quan đến **danh sách phim** dưới đây. 
                Nếu người dùng hỏi bất cứ điều gì **không liên quan đến phim**, bạn phải trả lời: 
                "Tôi chỉ có thể trả lời các câu hỏi liên quan đến phim trong hệ thống."
                
                DANH SÁCH PHIM:
                %s
                
                CÂU HỎI NGƯỜI DÙNG:
                %s
                """.formatted(movieData, userQuestion);


        String answer = openAiService.ask(prompt, apiKey);

        return ResponseEntity.ok(answer);
    }
}
