package kr.flowmeet.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import kr.flowmeet.domain.common.BaseTimeEntity;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE user_id = ?")
@SQLRestriction("deleted_at IS NULL")
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "primary_email", nullable = false, unique = true)
    private String primaryEmail;

    @Column(name = "second_email")
    private String secondEmail;

    @Column(name = "social_id", nullable = false)
    private String socialId;

    @Column(nullable = false)
    private String nickname;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Builder
    public User(String primaryEmail, String secondEmail,
                String socialId, String nickname, String profileImageUrl) {
        this.primaryEmail = primaryEmail;
        this.secondEmail = secondEmail;
        this.socialId = socialId;
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
    }

    public void updateNickname(final String nickname) {
        this.nickname = nickname;
    }

    public void updateSecondEmail(final String secondEmail) {
        this.secondEmail = secondEmail;
    }

    public void updateProfileImageUrl(final String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
}
