package kr.flowmeet.domain.user.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import kr.flowmeet.domain.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByIdAndDeletedAtIsNull(Long id);

    boolean existsByNicknameAndDeletedAtIsNull(String nickname);

    Optional<User> findByPrimaryEmailAndDeletedAtIsNull(String primaryEmail);
}
