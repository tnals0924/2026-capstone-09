package kr.flowmeet.api.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import kr.flowmeet.domain.chat.entity.ChatMessage;
import kr.flowmeet.domain.chat.entity.ChatMessageType;

@Schema(description = "채팅 메시지 응답")
public record ChatMessageResponse(
        @Schema(description = "메시지 ID", example = "5001")
        Long messageId,
        @Schema(description = "발신자 ID (AI 메시지는 null)", example = "91")
        Long senderId,
        @Schema(description = "발신자 닉네임", example = "홍길동")
        String senderNickname,
        @Schema(description = "메시지 내용")
        String content,
        @Schema(description = "메시지 타입", example = "USER")
        ChatMessageType messageType,
        @Schema(description = "액션 데이터 (AI_ACTION 타입만)")
        String actionData,
        @Schema(description = "생성 시각", example = "2026-04-19T10:01:00")
        LocalDateTime createdAt
) {
    public static ChatMessageResponse from(final ChatMessage message) {
        String nickname = message.getSender() != null
                ? message.getSender().getNickname()
                : "AI";

        return new ChatMessageResponse(
                message.getId(),
                message.getSenderId(),
                nickname,
                message.getContent(),
                message.getMessageType(),
                message.getActionData(),
                message.getCreatedAt()
        );
    }
}