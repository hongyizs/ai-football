import type { AiAnalysisResult } from '../types';

/**
 * WebSocket服务类
 * 封装WebSocket连接和重连逻辑
 */
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private listeners: Set<(data: AiAnalysisResult) => void> = new Set();
  private reconnectTimer: number | null = null;
  private token: string | null = null;

  constructor(
    private url: string,
    maxReconnectAttempts?: number,
    reconnectInterval?: number
  ) {
    if (maxReconnectAttempts !== undefined) {
      this.maxReconnectAttempts = maxReconnectAttempts;
    }
    if (reconnectInterval !== undefined) {
      this.reconnectInterval = reconnectInterval;
    }
  }

  /**
   * 设置认证token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * 建立WebSocket连接
   */
  connect(): void {
    try {
      // 如果有token，将其添加到URL查询参数中
      let wsUrl = this.url;
      if (this.token) {
        const separator = this.url.includes('?') ? '&' : '?';
        wsUrl = `${this.url}${separator}token=${encodeURIComponent(this.token)}`;
      }

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket连接成功');
        this.reconnectAttempts = 0;
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data: AiAnalysisResult = JSON.parse(event.data);
          this.notifyListeners(data);
        } catch (error) {
          console.error('解析消息失败:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket连接关闭');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
      };
    } catch (error) {
      console.error('创建WebSocket连接失败:', error);
      this.attemptReconnect();
    }
  }

  /**
   * 尝试重新连接
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );
      this.reconnectTimer = window.setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('达到最大重连次数');
    }
  }

  /**
   * 订阅消息
   * @param listener 消息监听器
   * @returns 取消订阅函数
   */
  subscribe(listener: (data: AiAnalysisResult) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(data: AiAnalysisResult): void {
    this.listeners.forEach((listener) => listener(data));
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = 0;
  }

  /**
   * 获取连接状态
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * 获取当前重连次数
   */
  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }
}
