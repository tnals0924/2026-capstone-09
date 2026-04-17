package kr.flowmeet.domain.project.service;

import com.querydsl.core.types.OrderSpecifier;
import kr.flowmeet.domain.project.entity.QProject;

public enum ProjectSortType {
    LATEST(QProject.project.updatedAt.desc()),
    NAME(QProject.project.name.asc());

    private final OrderSpecifier<?> orderSpecifier;

    ProjectSortType(final OrderSpecifier<?> orderSpecifier) {
        this.orderSpecifier = orderSpecifier;
    }

    public OrderSpecifier<?> toOrderSpecifier() {
        return orderSpecifier;
    }
}
