package kr.flowmeet.api.user.dto;

import java.time.LocalDateTime;
import kr.flowmeet.domain.user.entity.User;

public record GetUserResponse(
        String primaryEmail,
        String secondaryEmail,
        String nickname,
        String profileImageUrl,
        LocalDateTime createdAt
) {
    public static GetUserResponse from(final User user) {
        return new GetUserResponse(
                user.getPrimaryEmail(),
                user.getSecondEmail(),
                user.getNickname(),
                user.getProfileImageUrl(),
                user.getCreatedAt()
        );
    }
}