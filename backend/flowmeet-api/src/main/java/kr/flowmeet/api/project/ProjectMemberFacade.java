package kr.flowmeet.api.project;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.project.dto.GetAllMembersResponse;
import kr.flowmeet.api.project.dto.InviteMemberRequest;
import kr.flowmeet.api.project.dto.UpdateMemberRoleRequest;
import kr.flowmeet.domain.exception.BusinessException;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.exception.UserErrorCode;
import kr.flowmeet.domain.user.service.UserService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectMemberFacade {

    private final UserService userService;
    private final ProjectMemberService projectMemberService;

    public GetAllMembersResponse getAllMembers(final Long userId, final Long projectId) {
        projectMemberService.findByProjectIdAndUserId(projectId, userId);

        List<ProjectMember> members = projectMemberService.findAllByProjectIdOrderByRole(projectId);

        List<GetAllMembersResponse.MemberInfo> memberInfos = members.stream()
                .map(member -> GetAllMembersResponse.MemberInfo.of(member, member.getUser()))
                .toList();

        return GetAllMembersResponse.of(memberInfos);
    }

    @Transactional
    public void inviteMember(final Long userId, final Long projectId, final InviteMemberRequest request) {
        ProjectMember myMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (myMember.getRole() == ProjectMemberRole.VIEWER) {
            throw new BusinessException(ProjectErrorCode.MEMBER_INVITE_FORBIDDEN);
        }

        User invitee = userService.findByPrimaryEmail(request.email())
                .orElseThrow(() -> new BusinessException(UserErrorCode.USER_NOT_FOUND));

        if (projectMemberService.existsByProjectIdAndUserId(projectId, invitee.getId())) {
            throw new BusinessException(ProjectErrorCode.MEMBER_ALREADY_EXISTS);
        }

        projectMemberService.save(
                ProjectMember.builder()
                        .projectId(projectId)
                        .userId(invitee.getId())
                        .role(ProjectMemberRole.MEMBER)
                        .build()
        );
    }

    @Transactional
    public void updateMemberRole(final Long userId, final Long projectId, final Long memberId,
                                 final UpdateMemberRoleRequest request) {
        ProjectMember myMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!myMember.isOwner()) {
            throw new BusinessException(ProjectErrorCode.MEMBER_ROLE_CHANGE_FORBIDDEN);
        }

        ProjectMember targetMember = projectMemberService.findByIdAndProjectId(memberId, projectId);

        if (targetMember.isOwner()) {
            throw new BusinessException(ProjectErrorCode.MEMBER_CANNOT_CHANGE_OWNER);
        }

        if (request.role() == ProjectMemberRole.OWNER) {
            throw new BusinessException(ProjectErrorCode.MEMBER_CANNOT_CHANGE_OWNER);
        }

        targetMember.updateRole(request.role());
    }

    @Transactional
    public void deleteMember(final Long userId, final Long projectId, final Long memberId) {
        ProjectMember myMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!myMember.isOwner()) {
            throw new BusinessException(ProjectErrorCode.MEMBER_DELETE_FORBIDDEN);
        }

        ProjectMember targetMember = projectMemberService.findByIdAndProjectId(memberId, projectId);

        if (targetMember.isOwner()) {
            throw new BusinessException(ProjectErrorCode.MEMBER_CANNOT_DELETE_OWNER);
        }

        projectMemberService.delete(targetMember);
    }

    @Transactional
    public void leaveProject(final Long userId, final Long projectId) {
        ProjectMember myMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (myMember.isOwner()) {
            throw new BusinessException(ProjectErrorCode.PROJECT_OWNER_CANNOT_LEAVE);
        }

        projectMemberService.delete(myMember);
    }
}
