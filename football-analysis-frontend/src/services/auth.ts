import type { ApiResponse } from '../types';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

/**
 * 认证服务类
 */
export class AuthService {
  private static TOKEN_KEY = 'auth_token';
  private static USERNAME_KEY = 'username';

  constructor(private baseUrl: string) {}

  /**
   * 用户登录
   */
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const result: ApiResponse<LoginResponse> = await response.json();
    
    // 登录成功后保存token
    if (result.code === 0 && result.data) {
      this.saveToken(result.data.token);
      this.saveUsername(result.data.username);
    }
    
    return result;
  }

  /**
   * 保存token到localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem(AuthService.TOKEN_KEY, token);
  }

  /**
   * 获取token
   */
  getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  /**
   * 保存用户名
   */
  saveUsername(username: string): void {
    localStorage.setItem(AuthService.USERNAME_KEY, username);
  }

  /**
   * 获取用户名
   */
  getUsername(): string | null {
    return localStorage.getItem(AuthService.USERNAME_KEY);
  }

  /**
   * 清除认证信息
   */
  logout(): void {
    localStorage.removeItem(AuthService.TOKEN_KEY);
    localStorage.removeItem(AuthService.USERNAME_KEY);
  }

  /**
   * 检查是否已登录
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * 验证token
   */
  async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return false;
      }

      const result: ApiResponse<string> = await response.json();
      return result.code === 0;
    } catch (error) {
      console.error('Token验证失败:', error);
      return false;
    }
  }
}
