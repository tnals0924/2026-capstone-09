package kr.flowmeet.domain.notification.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import kr.flowmeet.domain.notification.entity.Notification;

public interface NotificationRepositoryCustom {

    Page<Notification> findAllByUserId(Long userId, Boolean isRead, Pageable pageable);
}
