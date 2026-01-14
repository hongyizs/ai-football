package cn.xingxing.websocket;

import cn.xingxing.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * WebSocket握手拦截器
 * 用于验证客户端的token
 */
@Slf4j
public class AuthHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {
        
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            
            // 从查询参数中获取token
            String query = servletRequest.getServletRequest().getQueryString();
            String token = extractToken(query);
            
            if (token == null || token.isEmpty()) {
                log.warn("WebSocket握手失败: 缺少token");
                return false;
            }
            
            // 验证token
            String username = JwtUtil.validateToken(token);
            if (username != null) {
                // 将用户名存储到WebSocket会话属性中
                attributes.put("username", username);
                log.info("WebSocket握手成功: username={}", username);
                return true;
            } else {
                log.warn("WebSocket握手失败: token无效");
                return false;
            }
        }
        
        return false;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
        // 握手完成后的处理（可选）
    }

    /**
     * 从查询字符串中提取token
     * @param query 查询字符串
     * @return token
     */
    private String extractToken(String query) {
        if (query == null || query.isEmpty()) {
            return null;
        }
        
        String[] params = query.split("&");
        for (String param : params) {
            String[] keyValue = param.split("=");
            if (keyValue.length == 2 && "token".equals(keyValue[0])) {
                return keyValue[1];
            }
        }
        
        return null;
    }
}
