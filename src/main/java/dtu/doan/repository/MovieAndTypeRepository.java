package dtu.doan.repository;

import dtu.doan.model.MovieAndType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieAndTypeRepository extends JpaRepository<MovieAndType, Long> {
}
