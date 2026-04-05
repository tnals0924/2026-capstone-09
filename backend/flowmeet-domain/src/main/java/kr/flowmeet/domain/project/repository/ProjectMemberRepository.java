package kr.flowmeet.domain.project.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findAllByProjectIdAndDeletedAtIsNull(Long projectId);

    @Query("SELECT pm FROM ProjectMember pm " +
            "JOIN FETCH pm.user u " +
            "WHERE pm.projectId = :projectId AND pm.deletedAt IS NULL AND u.deletedAt IS NULL " +
            "ORDER BY CASE pm.role WHEN 'OWNER' THEN 0 WHEN 'MEMBER' THEN 1 WHEN 'VIEWER' THEN 2 END, u.nickname ASC")
    List<ProjectMember> findAllByProjectIdOrderByRole(@Param("projectId") Long projectId);

    Optional<ProjectMember> findByIdAndDeletedAtIsNull(Long id);

    Optional<ProjectMember> findByIdAndProjectIdAndDeletedAtIsNull(Long id, Long projectId);

    Optional<ProjectMember> findByProjectIdAndUserIdAndDeletedAtIsNull(Long projectId, Long userId);

    boolean existsByProjectIdAndUserIdAndDeletedAtIsNull(Long projectId, Long userId);

    List<ProjectMember> findAllByUserIdAndDeletedAtIsNull(Long userId);

    boolean existsByUserIdAndRoleAndDeletedAtIsNull(Long userId, ProjectMemberRole role);

    int countByProjectIdAndDeletedAtIsNull(Long projectId);
}
