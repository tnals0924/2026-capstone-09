package kr.flowmeet.domain.project.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import kr.flowmeet.domain.project.entity.ProjectUrl;

public interface ProjectUrlRepository extends JpaRepository<ProjectUrl, Long> {

    List<ProjectUrl> findAllByProjectIdAndDeletedAtIsNull(Long projectId);

    Optional<ProjectUrl> findByIdAndProjectIdAndDeletedAtIsNull(Long id, Long projectId);
}
