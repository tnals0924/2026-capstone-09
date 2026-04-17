package kr.flowmeet.domain.notification.repository;

import static kr.flowmeet.domain.notification.entity.QNotification.notification;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import kr.flowmeet.domain.notification.entity.Notification;

@RequiredArgsConstructor
public class NotificationRepositoryCustomImpl implements NotificationRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Notification> findAllByUserId(
            final Long userId,
            final Boolean isRead,
            final Pageable pageable
    ) {
        List<Notification> content = queryFactory
                .selectFrom(notification)
                .where(
                        notification.userId.eq(userId),
                        isReadEq(isRead)
                )
                .orderBy(notification.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(notification.count())
                .from(notification)
                .where(
                        notification.userId.eq(userId),
                        isReadEq(isRead)
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0L : total);
    }

    private BooleanExpression isReadEq(final Boolean isRead) {
        if (isRead == null) {
            return null;
        }
        return notification.isRead.eq(isRead);
    }
}
