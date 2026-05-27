package kr.flowmeet.api.node.facade;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.node.dto.request.CreateAssigneeRequest;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import kr.flowmeet.domain.node.service.NodeAssigneeService;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.node.service.NodeValidator;
import kr.flowmeet.domain.notification.entity.NotificationSetting;
import kr.flowmeet.domain.notification.service.NotificationService;
import kr.flowmeet.domain.notification.service.NotificationSettingService;
import kr.flowmeet.domain.notification.service.vo.NodeAssignedNotificationCommand;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import kr.flowmeet.domain.project.service.ProjectService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NodeAssigneeFacade {

    private final NodeAssigneeService nodeAssigneeService;
    private final ProjectPermissionValidator projectPermissionValidator;
    private final NodeValidator nodeValidator;
    private final ProjectService projectService;
    private final NodeService nodeService;
    private final NotificationService notificationService;
    private final NotificationSettingService notificationSettingService;

    @Transactional
    public void createAssignee(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final CreateAssigneeRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        Long assigneeUserId = request.userId();

        nodeValidator.validateIsIn(nodeId, projectId);
        projectPermissionValidator.validate(projectId, assigneeUserId);

        nodeAssigneeService.create(nodeId, assigneeUserId);
        if (!assigneeUserId.equals(userId)) {
            sendNodeAssignedNotification(assigneeUserId, projectId, nodeId);
        }
    }

    @Transactional
    public void deleteAssignee(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final Long assigneeId
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        NodeAssignee nodeAssignee = nodeAssigneeService.findByIdAndNodeId(assigneeId, nodeId);

        nodeAssigneeService.delete(nodeAssignee);
    }

    private void sendNodeAssignedNotification(final Long assigneeUserId, final Long projectId, final Long nodeId) {
        notificationSettingService.findOptionalByUserIdAndProjectId(assigneeUserId, projectId)
                .filter(NotificationSetting::isNodeEnabled)
                .ifPresent(setting -> {
                    Project project = projectService.findById(projectId);
                    Node node = nodeService.findByIdAndProjectId(nodeId, projectId);
                    notificationService.send(NodeAssignedNotificationCommand.of(
                            assigneeUserId, projectId, nodeId, project.getName(), node.getTitle()));
                });
    }
}