package dtu.doan.Scheduler;

import dtu.doan.model.ShowTime;
import dtu.doan.repository.ShowTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ShowTimeStatusScheduler {

    @Autowired
    private ShowTimeRepository showTimeRepository;

//    @Scheduled(fixedRate = 5 * 60 * 1000) // mỗi 5 phút
//    public void updateShowTimeStatuses() {
//        LocalDateTime now = LocalDateTime.now();
//        List<ShowTime> activeShowTimes = showTimeRepository.findByStatus("ACTIVE");
//
//        for (ShowTime st : activeShowTimes) {
//            LocalDateTime endDateTime = LocalDateTime.of(st.getDate(), st.getStartTime());
//
//            if (endDateTime.isBefore(now)) {
//                st.setStatus("INACTIVE");
//                showTimeRepository.save(st);
//            }
//        }
//    }
}
