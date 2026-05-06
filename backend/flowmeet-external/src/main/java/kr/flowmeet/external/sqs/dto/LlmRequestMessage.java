package kr.flowmeet.external.sqs.dto;

public record LlmRequestMessage(
        String jobId,
        String taskType,
        String text
) {
}