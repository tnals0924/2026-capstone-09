package kr.flowmeet.api.project.dto;

import jakarta.validation.constraints.NotNull;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;

public record UpdateMemberRoleRequest(
        @NotNull(message = "역할은 필수로 입력해 주세요.")
        ProjectMemberRole role
) {
}