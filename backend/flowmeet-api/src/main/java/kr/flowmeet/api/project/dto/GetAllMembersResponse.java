package kr.flowmeet.api.project.dto;

import java.util.List;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.user.entity.User;

public record GetAllMembersResponse(
        List<MemberInfo> members
) {
    public static GetAllMembersResponse of(final List<MemberInfo> members) {
        return new GetAllMembersResponse(members);
    }

    public record MemberInfo(
            Long memberId,
            Long userId,
            String nickname,
            String email,
            String profileImageUrl,
            ProjectMemberRole role
    ) {
        public static MemberInfo of(final ProjectMember member, final User user) {
            return new MemberInfo(
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
