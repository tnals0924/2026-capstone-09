package kr.flowmeet.domain.project.repository;

import kr.flowmeet.domain.common.dto.CursorSlice;
import kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection;
import kr.flowmeet.domain.project.service.ProjectSortType;

public interface ProjectRepositoryCustom {

    CursorSlice<ProjectWithMemberCountProjection> findAllByUserId(
            Long userId,
            String search,
            ProjectSortType sort,
            Long cursorId,
            String cursorValue,
            int size
    );
}
