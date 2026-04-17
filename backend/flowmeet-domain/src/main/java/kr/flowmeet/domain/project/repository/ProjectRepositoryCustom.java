package kr.flowmeet.domain.project.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection;
import kr.flowmeet.domain.project.service.ProjectSortType;

public interface ProjectRepositoryCustom {

    Page<ProjectWithMemberCountProjection> findAllByUserId(
            Long userId,
            String search,
            ProjectSortType sort,
            Pageable pageable
    );
}
