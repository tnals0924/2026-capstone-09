package kr.flowmeet.api.node.facade;

import java.util.List;
import kr.flowmeet.domain.node.exception.TagErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.common.exception.ApiException;
import kr.flowmeet.api.node.dto.request.AddNodeTagRequest;
import kr.flowmeet.api.node.dto.request.CreateTagRequest;
import kr.flowmeet.api.node.dto.request.UpdateTagRequest;
import kr.flowmeet.api.node.dto.response.GetAllTagsResponse;
import kr.flowmeet.domain.node.entity.NodeTag;
import kr.flowmeet.domain.node.entity.Tag;
import kr.flowmeet.domain.node.exception.NodeErrorCode;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.node.service.NodeTagService;
import kr.flowmeet.domain.node.service.TagService;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.service.ProjectMemberService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagFacade {

    private final TagService tagService;
    private final NodeTagService nodeTagService;
    private final NodeService nodeService;
    private final ProjectMemberService projectMemberService;

    public GetAllTagsResponse getAllTags(final Long userId, final Long projectId) {
        projectMemberService.validateUserIsProjectMember(projectId, userId);

        List<Tag> tags = tagService.findAllByProjectId(projectId);
        return GetAllTagsResponse.from(tags);
    }

    @Transactional
    public void createTag(
            final Long userId,
            final Long projectId,
            final CreateTagRequest request
    ) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!projectMember.canEdit()) {
            throw new ApiException(TagErrorCode.TAG_CREATE_FORBIDDEN);
        }

        tagService.validateNameNotDuplicated(projectId, request.name());

        tagService.create(
                Tag.builder()
                        .projectId(projectId)
                        .name(request.name())
                        .color(request.color())
                        .build()
        );
    }

    @Transactional
    public void updateTag(
            final Long userId,
            final Long projectId,
            final Long tagId,
            final UpdateTagRequest request
    ) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!projectMember.canEdit()) {
            throw new ApiException(TagErrorCode.TAG_UPDATE_FORBIDDEN);
        }

        Tag tag = tagService.findByIdAndProjectId(tagId, projectId);
        String newName = request.name();

        if (!tag.getName().equals(newName)) {
            tagService.validateNameNotDuplicated(projectId, newName);
        }

        tag.update(newName, request.color());
    }

    @Transactional
    public void deleteTag(final Long userId, final Long projectId, final Long tagId) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!projectMember.canEdit()) {
            throw new ApiException(TagErrorCode.TAG_DELETE_FORBIDDEN);
        }

        Tag tag = tagService.findByIdAndProjectId(tagId, projectId);
        nodeTagService.deleteAllByTagId(tagId);
        tagService.delete(tag);
    }

    @Transactional
    public void addNodeTag(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final AddNodeTagRequest request
    ) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!projectMember.canEdit()) {
            throw new ApiException(TagErrorCode.NODE_TAG_ADD_FORBIDDEN);
        }

        nodeService.validateNodeIsInProject(projectId, nodeId);
        tagService.validateTagIsInProject(request.tagId(), projectId);
        nodeTagService.validateNotDuplicated(nodeId, request.tagId());

        nodeTagService.create(
                NodeTag.builder()
                        .nodeId(nodeId)
                        .tagId(request.tagId())
                        .build()
        );
    }

    @Transactional
    public void removeNodeTag(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final Long tagId
    ) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!projectMember.canEdit()) {
            throw new ApiException(TagErrorCode.NODE_TAG_DELETE_FORBIDDEN);
        }

        nodeService.findByIdAndProjectId(nodeId, projectId);
        nodeTagService.deleteByNodeIdAndTagId(nodeId, tagId);
    }
}
