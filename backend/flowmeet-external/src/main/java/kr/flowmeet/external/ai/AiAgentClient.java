package kr.flowmeet.external.ai;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import java.util.Map;
import kr.flowmeet.external.ai.dto.AiChatResponse;
import kr.flowmeet.external.exception.ExternalException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiAgentClient {

    private final RestClient aiAgentRestClient;
    private final ObjectMapper objectMapper;

    public String chat(final String message, final String sessionId, final Long projectId, final String authorization) {
        String requestBody;
        try {
            requestBody = objectMapper.writeValueAsString(Map.of(
                    "message", message,
                    "session_id", sessionId,
                    "project_id", String.valueOf(projectId)
            ));
        } catch (JacksonException e) {
            throw new ExternalException(AiAgentErrorCode.AI_AGENT_UNAVAILABLE);
        }

        log.info("AI Agent 호출 - sessionId: {}", sessionId);

        try {
            AiChatResponse response = aiAgentRestClient.post()
                    .uri("/chat")
                    .header("Authorization", authorization)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(AiChatResponse.class);

            return response.response();
        } catch (Exception e) {
            log.error("AI Agent 호출 실패 - sessionId: {}", sessionId, e);
            throw new ExternalException(AiAgentErrorCode.AI_AGENT_UNAVAILABLE);
        }
    }
}