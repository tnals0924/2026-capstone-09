
package kr.flowmeet.api.project.dto;

import java.util.List;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.user.entity.User;

public record GetAllProjectMembersResponse(
        List<ProjectMemberInfo> members
) {
    public static GetAllProjectMembersResponse of(final List<ProjectMemberInfo> members) {
        return new GetAllProjectMembersResponse(members);
    }

    public record ProjectMemberInfo(
            Long memberId,
            Long userId,
            String nickname,
            String email,
            String profileImageUrl,
            ProjectMemberRole role
    ) {
        public static ProjectMemberInfo of(final ProjectMember member, final User user) {
            return new ProjectMemberInfo(
                    member.getId(),
                    user.getId(),
                    user.getNickname(),
                    user.getPrimaryEmail(),
                    user.getProfileImageUrl(),
                    member.getRole()
            );
        }
    }
}