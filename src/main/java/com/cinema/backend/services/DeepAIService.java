package com.cinema.backend.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DeepAIService {

    private static final Logger logger = LoggerFactory.getLogger(DeepAIService.class);

    @Value("${deepai.api.key}")
    private String apiKey;

    private static final String API_URL = "https://api.deepai.org/api/text-generator";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public DeepAIService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String ask(String userMessage) {
        try {
            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("api-key", apiKey);

            // Build the request body
            String requestBody = "text=" + userMessage;

            // Create request entity
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            logger.debug("Sending request to DeepAI API: {}", userMessage);

            // Make the API call
            ResponseEntity<String> response = restTemplate.exchange(
                    API_URL,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            // Process the response
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                logger.debug("Received DeepAI response: {}", root);

                if (root.has("output")) {
                    return root.get("output").asText();
                }
                return parseErrorResponse(root);
            } else {
                logger.error("DeepAI API returned non-success status: {}", response.getStatusCode());
                return "DeepAI API error: " + response.getStatusCode();
            }

        } catch (Exception e) {
            logger.error("Error communicating with DeepAI", e);
            return "Error communicating with DeepAI: " + e.getMessage();
        }
    }

    private String parseErrorResponse(JsonNode root) {
        if (root.has("err")) {
            return "DeepAI error: " + root.get("err").asText();
        }
        return "Unknown error from DeepAI API";
    }
}