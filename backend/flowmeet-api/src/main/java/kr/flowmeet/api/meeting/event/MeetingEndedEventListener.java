package kr.flowmeet.api.meeting.event;

import kr.flowmeet.external.sqs.SqsMessageSender;
import kr.flowmeet.external.sqs.dto.LlmRequestMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class MeetingEndedEventListener {

    private final SqsMessageSender sqsMessageSender;

    @TransactionalEventListener
    public void handle(final MeetingEndedEvent event) {
        log.info("회의 종료 이벤트 수신 - jobId: {}", event.jobId());
        sqsMessageSender.send(new LlmRequestMessage(event.jobId(), "sub-summary", event.text()));
    }
}