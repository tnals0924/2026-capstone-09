package kr.flowmeet.api.user.dto;

import jakarta.validation.constraints.Email;

public record UpdateUserRequest(
        String nickname,
        @Email(message = "유효하지 않은 이메일 형식입니다.")
        String secondaryEmail
) {
}