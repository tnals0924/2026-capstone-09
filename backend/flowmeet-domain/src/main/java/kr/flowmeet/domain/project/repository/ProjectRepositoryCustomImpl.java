package kr.flowmeet.domain.project.repository;

import static kr.flowmeet.domain.project.entity.QProject.project;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;
import kr.flowmeet.domain.project.entity.QProjectMember;
import kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection;
import kr.flowmeet.domain.project.service.ProjectSortType;

@RequiredArgsConstructor
public class ProjectRepositoryCustomImpl implements ProjectRepositoryCustom {

    private static final QProjectMember memberFilter = new QProjectMember("memberFilter");
    private static final QProjectMember memberCounter = new QProjectMember("memberCounter");

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<ProjectWithMemberCountProjection> findAllByUserId(
            final Long userId,
            final String search,
            final ProjectSortType sort,
            final Pageable pageable
    ) {
        List<ProjectWithMemberCountProjection> content = queryFactory
                .select(Projections.constructor(
                        ProjectWithMemberCountProjection.class,
                        project,
                        memberCounter.count()
                ))
                .from(project)
                .join(memberFilter).on(memberFilter.projectId.eq(project.id))
                .join(memberCounter).on(memberCounter.projectId.eq(project.id))
                .where(
                        memberFilter.userId.eq(userId),
                        nameContains(search)
                )
                .groupBy(project)
                .orderBy(sort.toOrderSpecifier())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(project.countDistinct())
                .from(project)
                .join(memberFilter).on(memberFilter.projectId.eq(project.id))
                .where(
                        memberFilter.userId.eq(userId),
                        nameContains(search)
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0L : total);
    }

    private BooleanExpression nameContains(final String search) {
        if (!StringUtils.hasText(search)) {
            return null;
        }
        return project.name.contains(search);
    }
}
