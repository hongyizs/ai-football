package cn.xingxing.dto;

import lombok.Data;

/**
 * 登录响应
 */
@Data
public class LoginResponse {
    private String token;
    private String username;
}
