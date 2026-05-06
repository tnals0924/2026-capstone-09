package kr.flowmeet.domain.auth.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import kr.flowmeet.domain.auth.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    void deleteAllByUserId(Long userId);
}
