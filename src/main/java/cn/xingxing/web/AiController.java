package cn.xingxing.web;


import cn.xingxing.ai.Assistant;
import cn.xingxing.service.StreamingAssistant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import static org.springframework.http.MediaType.TEXT_EVENT_STREAM_VALUE;

/**
 * @Author: yangyuanliang
 * @Date: 2025-12-09
 * @Version: 1.0
 */
@RestController
public class AiController {
    @Autowired
    Assistant assistant;

    @Autowired
    private StreamingAssistant streamingAssistant;

    @GetMapping("/chat")
    public String chat(String message) {
        return assistant.chat(message);
    }

    @GetMapping(value = "/streamingAssistant", produces = "text/event-stream; charset=utf-8")
    public Flux<String> streamingAssistant(
            @RequestParam(value = "message", defaultValue = "What is the current time?") String message) {
        return streamingAssistant.chat(message);
    }
}
