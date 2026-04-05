package kr.flowmeet.api.user.dto;

import kr.flowmeet.domain.user.entity.User;

public record UpdateUserResponse(
        Long userId,
        String primaryEmail,
        String secondaryEmail,
        String nickname,
        String profileImageUrl
) {
    public static UpdateUserResponse from(final User user) {
        return new UpdateUserResponse(
                user.getId(),
                user.getPrimaryEmail(),
                user.getSecondEmail(),
                user.getNickname(),
                user.getProfileImageUrl()
        );
    }
}