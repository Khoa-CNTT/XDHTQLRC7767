package dtu.doan.web;

import dtu.doan.dto.MovieResponseDTO;
import dtu.doan.model.Movie;
import dtu.doan.model.ShowTime;
import dtu.doan.model.Ticket;
import dtu.doan.repository.ShowTimeRepository;
import dtu.doan.service.AccountService;
import dtu.doan.service.MovieService;
import dtu.doan.service.TicketService;
import dtu.doan.service.impl.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ShowTimeRepository showTimeRepository;
    @Autowired
    private MovieService movieService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private OpenAiService openAiService;
    @Autowired
    private TicketService ticketService;

    @Value("${openai.api.key}")
    private String apiKey;

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            return principal instanceof UserDetails ? ((UserDetails) principal).getUsername() : principal.toString();
        }
        return null;
    }

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody String userQuestion) {

        String username = getCurrentUsername();
        if (username == null) {
            return ResponseEntity.badRequest().body("Bạn cần đăng nhập để sử dụng tính năng này.");
        }
        if (userQuestion == null || userQuestion.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Câu hỏi không được để trống.");
        }
        Long idCustomer = accountService.getCustomerIdByUsername(username);
        List<Ticket> tickets = new ArrayList<>(ticketService.getTicketByCustomer(idCustomer));

        List<MovieResponseDTO> movieList = movieService.findAll();


        List<ShowTime> showTimes = showTimeRepository.findAll()
                .stream()
                .limit(30) // Giới hạn 30 suất chiếu
                .toList();
        String ticketHistoryData = formatTicketHistory(tickets);
        String movieData = formatMovieData(movieList);
        String showTimeData = formatShowTimeData(showTimes);
        String instructions = getBookingInstructions();
        String suggestedMovies = suggestMovies(tickets, movieList);
        String upcomingShowTimes = suggestFutureShowTimes(showTimes);

        String prompt = String.format("""
                Bạn là một nhân viên bán vé tại rạp phim. Nhiệm vụ của bạn là:
                - Giới thiệu các suất chiếu phim, thời gian, giá vé, phòng chiếu
                - Giúp khách chọn suất chiếu và ghế ngồi
                - Trả lời các thắc mắc liên quan đến phim, giờ chiếu, rạp
                - KHÔNG trả lời các câu hỏi không liên quan đến rạp phim
                - Có thể đề xuất lại phim khách đã xem hoặc gợi ý phim mới phù hợp
                
                THÔNG TIN PHIM:
                %s
                
                DANH SÁCH SUẤT CHIẾU:
                %s
                
                LỊCH SỬ MUA VÉ CỦA NGƯỜI DÙNG:
                %s
                
                %s
                %s
                
                CÂU HỎI NGƯỜI DÙNG:
                %s
                """, movieData, showTimeData + instructions, ticketHistoryData, suggestedMovies, upcomingShowTimes, userQuestion);

        String answer = openAiService.ask(prompt, apiKey);
        return ResponseEntity.ok(answer);
    }

    private String formatTicketHistory(List<Ticket> tickets) {
        return tickets.stream().map(ticket -> {
            if (ticket == null || ticket.getShowTime() == null || ticket.getShowTime().getMovie() == null) {
                return "- Thông tin vé không đầy đủ.";
            }
            return String.format(
                    "- Mã vé: %d\n  Tên phim: %s\n  Ngày xem: %s\n  Giờ bắt đầu: %s\n  Rạp: %s\n  Trạng thái: %s",
                    ticket.getId(),
                    ticket.getShowTime().getMovie().getName(),
                    ticket.getShowTime().getDate(),
                    ticket.getShowTime().getStartTime(),
                    ticket.getShowTime().getRoom() != null && ticket.getShowTime().getRoom().getCinema() != null
                            ? ticket.getShowTime().getRoom().getCinema().getName()
                            : "Không xác định",
                    ticket.getUsed() ? "Đã sử dụng" : "Chưa sử dụng"
            );
        }).collect(Collectors.joining("\n\n"));
    }

    private String formatMovieData(List<MovieResponseDTO> movies) {
        return movies.stream().map(movie -> {
            if (movie == null) {
                return "- Thông tin phim không đầy đủ.";
            }
            String status = switch (movie.getStatus()) {
                case 1 -> "Đang chiếu";
                case 0 -> "Sắp chiếu";
                case 2 -> "Đã chiếu";
                default -> "Không xác định";
            };

            String genres = movie.getMovieGenres() != null
                    ? movie.getMovieGenres().stream()
                    .map(g -> g.getName() != null ? g.getName() : "Không xác định")
                    .collect(Collectors.joining(", "))
                    : "Không xác định";

            String actors = movie.getActors() != null
                    ? String.join(", ", movie.getActors())
                    : "Không xác định";

            return String.format("""
                            - Tên phim: %s
                              Mô tả: %s
                              Đạo diễn: %s
                              Diễn viên: %s
                              Năm phát hành: %d
                              Quốc gia: %s
                              Ngôn ngữ: %s
                              Thời lượng: %d phút
                              Độ tuổi: %d+
                              Ngày phát hành: %s
                              Trạng thái: %s
                              Thể loại: %s
                            """,
                    movie.getName(), movie.getDescription(), movie.getDirector(),
                    actors, movie.getReleaseYear(), movie.getCountry(),
                    movie.getLanguage(), movie.getDuration(), movie.getAgeLimit(),
                    movie.getReleaseDate(), status, genres);
        }).collect(Collectors.joining("\n"));
    }

    private String formatShowTimeData(List<ShowTime> showTimes) {
        return showTimes.stream().map(st -> {
            if (st == null || st.getMovie() == null) {
                return "- Thông tin suất chiếu không đầy đủ.";
            }
            String status = switch (st.getMovie().getStatus()) {
                case 1 -> "Đang chiếu";
                case 0 -> "Sắp chiếu";
                case 2 -> "Đã chiếu";
                default -> "Không xác định";
            };
            return String.format("""
                            - Tên phim: %s
                              Ngày: %s
                              Giờ bắt đầu: %s
                              Giờ kết thúc: %s
                              Giá vé: %d VND
                              Phòng chiếu: %s
                              Trạng thái: %s
                            """,
                    st.getMovie().getName(), st.getDate(), st.getStartTime(), st.getEndTime(),
                    st.getPricePerShowTime(),
                    st.getRoom() != null ? st.getRoom().getName() : "Không xác định",
                    status);
        }).collect(Collectors.joining("\n"));
    }

    private String suggestMovies(List<Ticket> tickets, List<MovieResponseDTO> allMovies) {
        Set<String> watchedGenres = tickets.stream()
                .flatMap(ticket -> ticket.getShowTime().getMovie().getMovieGenres().stream())
                .map(g -> g.getGenre().getName())
                .collect(Collectors.toSet());

        Set<Long> watchedMovieIds = tickets.stream()
                .map(ticket -> ticket.getShowTime().getMovie().getId())
                .collect(Collectors.toSet());

        List<MovieResponseDTO> recommended = allMovies.stream()
                .filter(movie -> !watchedMovieIds.contains(movie.getId()))
                .filter(movie -> movie.getMovieGenres().stream()
                        .anyMatch(g -> watchedGenres.contains(g.getName())))
                .limit(10)
                .collect(Collectors.toList());

        if (recommended.isEmpty()) return "";

        String content = recommended.stream()
                .map(m -> String.format("- %s (%s)", m.getName(), m.getReleaseDate()))
                .collect(Collectors.joining("\n"));

        return "\n\n👉 DỰA TRÊN PHIM BẠN ĐÃ XEM, BẠN CÓ THỂ THÍCH:\n" + content;
    }

    private String suggestFutureShowTimes(List<ShowTime> showTimes) {
        LocalDateTime now = LocalDateTime.now();
        String content = showTimes.stream()
                .filter(st -> st.getDate() != null && st.getStartTime() != null)
                .filter(st -> LocalDateTime.of(st.getDate(), st.getStartTime()).isAfter(now))
                .map(st -> String.format("- %s | %s | %s | %s", st.getMovie().getName(), st.getDate(), st.getStartTime(), st.getRoom().getName()))
                .collect(Collectors.joining("\n"));

        return "\n\n👉 CÁC GIỜ CHIẾU SẮP TỚI CÒN CHỖ:\n" + content;
    }

    private String getBookingInstructions() {
        return """
                \n\n👉 Để đặt vé:
                1. Đăng nhập tài khoản thành viên
                2. Chọn phim muốn xem
                3. Chọn rạp và suất chiếu
                4. Chọn ghế
                5. Thanh toán và nhận mã QR qua email
                👉 Mang mã QR đến rạp để được kiểm tra trước khi vào xem phim nhé!
                """;
    }
}
