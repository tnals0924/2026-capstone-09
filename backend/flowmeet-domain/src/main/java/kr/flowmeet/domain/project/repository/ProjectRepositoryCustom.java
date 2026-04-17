package kr.flowmeet.domain.project.repository;

import java.util.List;
import kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection;
import kr.flowmeet.domain.project.service.ProjectSortType;

public interface ProjectRepositoryCustom {

    List<ProjectWithMemberCountProjection> findAllByUserId(
            Long userId,
            String search,
            ProjectSortType sort,
            Long cursorId,
            String cursorValue,
            int size
    );
}
