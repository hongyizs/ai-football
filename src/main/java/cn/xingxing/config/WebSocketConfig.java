package cn.xingxing.config;

import cn.xingxing.websocket.AnalysisWebSocketHandler;
import cn.xingxing.websocket.AuthHandshakeInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * WebSocket配置类
 * 配置WebSocket服务器端点和消息处理器
 */
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // 注册WebSocket处理器，端点为 /ws/analysis
        // 允许所有来源的跨域请求
        // 添加握手拦截器进行token验证
        registry.addHandler(analysisWebSocketHandler(), "/ws/analysis")
                .setAllowedOrigins("*")
                .addInterceptors(new AuthHandshakeInterceptor());
    }

    @Bean
    public AnalysisWebSocketHandler analysisWebSocketHandler() {
        return new AnalysisWebSocketHandler();
    }
}
