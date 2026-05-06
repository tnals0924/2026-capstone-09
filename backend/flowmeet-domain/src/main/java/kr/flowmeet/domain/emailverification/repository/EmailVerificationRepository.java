package kr.flowmeet.domain.emailverification.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.emailverification.entity.EmailVerification;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification> findTopByUserIdAndEmailAndVerifiedAtIsNullOrderByCreatedAtDesc(
            Long userId, String email
    );

    Optional<EmailVerification> findTopByUserIdAndEmailAndVerifiedAtIsNotNullOrderByCreatedAtDesc(
            Long userId, String email
    );

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM EmailVerification ev WHERE ev.userId = :userId AND ev.email = :email")
    int deleteAllByUserIdAndEmail(@Param("userId") Long userId, @Param("email") String email);
}
