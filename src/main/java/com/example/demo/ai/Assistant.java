package com.example.demo.ai;


import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.spring.AiService;

/**
 * @Author: yangyuanliang
 * @Date: 2025-12-09
 * @Version: 1.0
 */
@AiService
public interface Assistant {
    @SystemMessage("You are a polite assistant")
    String chat(String userMessage);
}
