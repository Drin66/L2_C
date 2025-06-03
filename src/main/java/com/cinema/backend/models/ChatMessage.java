package com.cinema.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "chatMessages")
public class ChatMessage {

    @Id
    private String id;

    private String message;   // user input
    private String response;  // AI response

    // Default constructor
    public ChatMessage() {}

    public ChatMessage(String message, String response) {
        this.message = message;
        this.response = response;
    }

    public String getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
}
