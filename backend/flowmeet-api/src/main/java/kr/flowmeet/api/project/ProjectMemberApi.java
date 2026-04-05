package kr.flowmeet.api.project;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.project.dto.GetAllMembersResponse;
import kr.flowmeet.api.project.dto.InviteMemberRequest;
import kr.flowmeet.api.project.dto.UpdateMemberRoleRequest;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;

@Tag(name = "Project Member")
public interface ProjectMemberApi {

    @Operation(summary = "멤버 목록 조회")
    CommonResponse<GetAllMembersResponse> getAllMembers(@UserId Long userId, @PathVariable Long projectId);

    @Operation(summary = "멤버 초대")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"MEMBER_ALREADY_EXISTS", "MEMBER_INVITE_FORBIDDEN"})
    CommonResponse<?> inviteMember(@UserId Long userId, @PathVariable Long projectId,
                                   @Valid @RequestBody InviteMemberRequest request);

    @Operation(summary = "멤버 권한 수정", description = "OWNER만 변경할 수 있습니다.")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"MEMBER_NOT_FOUND", "MEMBER_ROLE_CHANGE_FORBIDDEN", "MEMBER_CANNOT_CHANGE_OWNER"})
    CommonResponse<?> updateMemberRole(@UserId Long userId, @PathVariable Long projectId,
                                       @PathVariable Long memberId,
                                       @Valid @RequestBody UpdateMemberRoleRequest request);

    @Operation(summary = "멤버 삭제", description = "OWNER만 삭제할 수 있습니다.")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"MEMBER_NOT_FOUND", "MEMBER_DELETE_FORBIDDEN", "MEMBER_CANNOT_DELETE_OWNER"})
    CommonResponse<?> deleteMember(@UserId Long userId, @PathVariable Long projectId,
                                   @PathVariable Long memberId);

    @Operation(summary = "프로젝트 나가기")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_OWNER_CANNOT_LEAVE"})
    CommonResponse<?> leaveProject(@UserId Long userId, @PathVariable Long projectId);
}
