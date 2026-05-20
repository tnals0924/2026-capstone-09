package kr.flowmeet.external.ai.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
@EnableConfigurationProperties(AiAgentProperties.class)
public class AiAgentConfig {

    @Bean
    public RestClient aiAgentRestClient(final RestClient.Builder builder, final AiAgentProperties properties) {
        return builder
                .baseUrl(properties.getUrl())
                .build();
    }
}