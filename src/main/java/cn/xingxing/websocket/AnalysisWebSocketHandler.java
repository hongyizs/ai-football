package cn.xingxing.websocket;

import cn.xingxing.domain.AiAnalysisResult;
import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * WebSocket消息处理器
 * 处理WebSocket连接和消息推送
 */
@Slf4j
@Component
public class AnalysisWebSocketHandler extends TextWebSocketHandler {

    /**
     * 线程安全的会话集合，维护所有活动的WebSocket连接
     */
    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    /**
     * 连接建立时调用
     * @param session WebSocket会话
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        String username = (String) session.getAttributes().get("username");
        log.info("WebSocket连接建立: sessionId={}, username={}, 当前连接数={}", 
                session.getId(), username, sessions.size());
    }

    /**
     * 连接关闭时调用
     * @param session WebSocket会话
     * @param status 关闭状态
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        log.info("WebSocket连接关闭: sessionId={}, 关闭状态={}, 当前连接数={}", 
                session.getId(), status, sessions.size());
    }

    /**
     * 广播消息到所有已连接的客户端
     * @param result AI分析结果
     */
    public void broadcast(AiAnalysisResult result) {
        if (result == null) {
            log.warn("尝试广播空的分析结果");
            return;
        }

        String message = JSON.toJSONString(result);
        TextMessage textMessage = new TextMessage(message);
        
        log.info("开始广播消息: matchId={}, 目标连接数={}", result.getMatchId(), sessions.size());

        // 使用同步块确保线程安全
        synchronized (sessions) {
            sessions.forEach(session -> {
                try {
                    if (session.isOpen()) {
                        session.sendMessage(textMessage);
                        log.debug("消息推送成功: sessionId={}", session.getId());
                    } else {
                        log.warn("会话已关闭，跳过推送: sessionId={}", session.getId());
                    }
                } catch (IOException e) {
                    log.error("推送消息失败: sessionId={}, error={}", session.getId(), e.getMessage(), e);
                    // 不抛出异常，继续处理其他连接
                }
            });
        }
        
        log.info("消息广播完成: matchId={}", result.getMatchId());
    }

    /**
     * 获取当前活动连接数
     * @return 连接数
     */
    public int getActiveConnectionCount() {
        return sessions.size();
    }

    /**
     * 处理传输错误
     */
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("WebSocket传输错误: sessionId={}, error={}", session.getId(), exception.getMessage(), exception);
        if (session.isOpen()) {
            session.close();
        }
        sessions.remove(session);
    }
}
