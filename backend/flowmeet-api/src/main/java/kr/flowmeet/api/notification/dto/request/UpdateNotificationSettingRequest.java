package kr.flowmeet.api.notification.dto.request;

public record UpdateNotificationSettingRequest(
        Boolean meetingEnabled,
        Boolean nodeEnabled,
        Boolean desktopEnabled,
        Boolean emailEnabled
) {
}