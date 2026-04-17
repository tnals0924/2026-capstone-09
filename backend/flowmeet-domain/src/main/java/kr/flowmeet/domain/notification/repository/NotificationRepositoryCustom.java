package kr.flowmeet.domain.notification.repository;

import kr.flowmeet.domain.common.dto.CursorSlice;
import kr.flowmeet.domain.notification.entity.Notification;

public interface NotificationRepositoryCustom {

    CursorSlice<Notification> findAllByUserId(Long userId, Boolean isRead, Long cursorId, int size);
}
