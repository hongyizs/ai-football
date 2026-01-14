package cn.xingxing.web;

import cn.xingxing.dto.ApiResponse;
import cn.xingxing.dto.LoginRequest;
import cn.xingxing.dto.LoginResponse;
import cn.xingxing.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    /**
     * 用户登录
     * @param request 登录请求
     * @return 登录响应（包含token）
     */
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        log.info("用户登录请求: username={}", request.getUsername());
        
        // 简单的用户名密码验证（实际项目中应该查询数据库）
        if ("admin".equals(request.getUsername()) && "123456".equals(request.getPassword())) {
            // 生成JWT token
            String token = JwtUtil.generateToken(request.getUsername());
            
            LoginResponse response = new LoginResponse();
            response.setToken(token);
            response.setUsername(request.getUsername());
            
            log.info("登录成功: username={}", request.getUsername());
            return ApiResponse.success(response);
        } else {
            log.warn("登录失败: username={}", request.getUsername());
            return ApiResponse.error("用户名或密码错误");
        }
    }

    /**
     * 验证token
     * @param token JWT token
     * @return 验证结果
     */
    @GetMapping("/verify")
    public ApiResponse<String> verifyToken(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            String username = JwtUtil.validateToken(token);
            if (username != null) {
                return ApiResponse.success(username);
            } else {
                return ApiResponse.error("Token无效");
            }
        } catch (Exception e) {
            log.error("Token验证失败", e);
            return ApiResponse.error("Token验证失败");
        }
    }
}
