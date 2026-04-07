package kr.flowmeet.api.project.dto;

import java.time.LocalDateTime;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection;

public record ProjectSummary(
        Long projectId,
        String name,
        int memberCount,
        LocalDateTime updatedAt
) {
    public static ProjectSummary from(final ProjectWithMemberCountProjection projection) {
        Project project = projection.project();
        return new ProjectSummary(
                project.getId(),
                project.getName(),
                projection.memberCount().intValue(),
                project.getUpdatedAt()
        );
    }
}
