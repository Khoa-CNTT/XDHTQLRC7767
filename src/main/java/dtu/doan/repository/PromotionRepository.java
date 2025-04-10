package dtu.doan.repository;

import dtu.doan.model.Promotion;
import dtu.doan.model.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    @Query("SELECT r FROM Promotion r WHERE r.title LIKE %:title%")
    Page<Promotion> listPromotion(@Param("title") String title, Pageable pageable);

}
