package dtu.doan.web;

import dtu.doan.model.Movie;
import dtu.doan.model.ShowTime;
import dtu.doan.repository.MovieRepository;
import dtu.doan.repository.ShowTimeRepository;
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
    private ShowTimeRepository showTimeRepository;

    @Autowired
    private OpenAiService openAiService;

    @Value("${openai.api.key}")
    private String apiKey;

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody String userQuestion) {
        List<ShowTime> showTimes = showTimeRepository.findAll();

        String showTimeData = showTimes.stream().map(showTime -> {
            String statusText;
            if (showTime.getMovie().getStatus() == 1) {
                statusText = "Đang chiếu";
            } else if (showTime.getMovie().getStatus() == 0) {
                statusText = "Sắp chiếu";
            } else if (showTime.getMovie().getStatus() == 2) {
                statusText = "Đã chiếu";
            } else {
                statusText = "Không xác định";
            }

            return String.format(
                    "- Tên phim: %s\n  Mô tả: %s\n  Đạo diễn: %s\n  Diễn viên: %s\n  Năm phát hành: %d\n  Quốc gia: %s\n  Ngôn ngữ: %s\n  Thời lượng: %d phút\n  Độ tuổi: %d+\n  Ngày phát hành: %s\n  Trạng thái: %s\n  Ngày: %s\n  Giờ bắt đầu: %s\n  Giờ kết thúc: %s\n  Giá: %d VND\n  Phòng: %s\n",
                    showTime.getMovie().getName(),
                    showTime.getMovie().getDescription(),
                    showTime.getMovie().getDirector(),
                    showTime.getMovie().getActor(),
                    showTime.getMovie().getReleaseYear(),
                    showTime.getMovie().getCountry(),
                    showTime.getMovie().getLanguage(),
                    showTime.getMovie().getDuration(),
                    showTime.getMovie().getAgeLimit(),
                    showTime.getMovie().getReleaseDate().toString(),
                    statusText,
                    showTime.getDate().toString(),
                    showTime.getStartTime().toString(),
                    showTime.getEndTime().toString(),
                    showTime.getPricePerShowTime(),
                    showTime.getRoom().getName()
            );
        }).collect(Collectors.joining("\n"));

        String prompt = """
                      Bạn là một nhân viên bán vé tại rạp phim. Nhiệm vụ của bạn là:
                      - Giới thiệu các suất chiếu phim, thời gian, giá vé, phòng chiếu
                      - Giúp khách chọn suất chiếu và ghế ngồi
                      - Trả lời các thắc mắc liên quan đến phim, giờ chiếu, rạp
                      - KHÔNG trả lời các câu hỏi không liên quan đến rạp phim
                
                      DANH SÁCH PHIM VÀ SUẤT CHIẾU:
                      %s
                
                      CÂU HỎI NGƯỜI DÙNG:
                      %s
                """.formatted(showTimeData, userQuestion);


        String answer = openAiService.ask(prompt, apiKey);

        return ResponseEntity.ok(answer);
    }
}
