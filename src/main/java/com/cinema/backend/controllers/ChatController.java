package com.cinema.backend.controllers;

import com.cinema.backend.models.ChatMessage;
import com.cinema.backend.repositories.ChatMessageRepository;
import com.cinema.backend.services.DeepAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/chat")
@CrossOrigin
public class ChatController {

    @Autowired
    private ChatMessageRepository chatRepo;

    @Autowired
    private DeepAIService deepAIService; // Changed from GeminiService

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody ChatMessage message) {
        try {
            String response = deepAIService.ask(message.getMessage());
            message.setResponse(response);
            ChatMessage savedMessage = chatRepo.save(message);
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<ChatMessage>> getAllMessages() {
        return ResponseEntity.ok(chatRepo.findAll());
    }
}