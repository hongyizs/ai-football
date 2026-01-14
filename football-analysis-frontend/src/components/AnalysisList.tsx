import { Show, onMount, onCleanup } from 'solid-js';
import { AnalysisTable } from './AnalysisTable';
import { createAnalysisStore } from '../store/analysisStore';
import { WebSocketService } from '../services/websocket';
import { ApiService } from '../services/api';
import { AuthService } from '../services/auth';

/**
 * 分析结果列表主组件
 */
export function AnalysisList() {
  const store = createAnalysisStore();
  
  // 从环境变量获取配置，开发环境使用代理
  const apiUrl = import.meta.env.VITE_API_URL || '/foot';
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:9000/foot/ws/analysis';
  
  const wsService = new WebSocketService(wsUrl);
  const apiService = new ApiService(apiUrl);
  const authService = new AuthService(apiUrl);

  // 登出处理
  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  onMount(async () => {
    // 获取token并设置到WebSocket服务
    const token = authService.getToken();
    if (token) {
      wsService.setToken(token);
    }

    // 加载初始数据
    await store.loadInitialData(apiService);

    // 建立WebSocket连接
    wsService.connect();

    // 订阅新数据
    const unsubscribe = wsService.subscribe((data) => {
      console.log('收到新的分析结果:', data);
      store.addAnalysis(data);
      store.setConnected(true);
    });

    // 清理函数
    onCleanup(() => {
      unsubscribe();
      wsService.disconnect();
    });
  });

  // 滚动加载更多
  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;
    
    if (bottom && store.hasMore() && !store.loading()) {
      store.loadMore(apiService);
    }
  };

  return (
    <div 
      class="container box-border mx-auto px-4 py-6 max-w-7xl overflow-y-auto"
      onScroll={handleScroll}
    >
      {/* 头部 */}
      <div class="mb-6 sticky top-0 bg-white z-10 pb-4 border-b shadow-sm">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold mb-2 text-gray-800">⚽ 足球AI分析系统</h1>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <div
                  class={`w-3 h-3 rounded-full ${
                    wsService.isConnected() ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}
                />
                <span class="text-sm text-gray-600">
                  {wsService.isConnected() ? '实时连接' : '连接断开'}
                </span>
              </div>
              <div class="text-sm text-gray-600">
                共 {store.analysisList().length} 条数据
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            退出登录
          </button>
        </div>
      </div>

      {/* 加载状态 */}
      <Show when={store.loading() && store.analysisList().length === 0}>
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p class="mt-4 text-gray-600">加载中...</p>
        </div>
      </Show>

      {/* 错误提示 */}
      <Show when={store.error()}>
        <div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-start">
          <svg class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="flex-1">
            <p class="font-bold">错误</p>
            <p class="mt-1">{store.error()}</p>
            <button
              class="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors text-sm font-medium"
              onClick={() => store.retry(apiService)}
            >
              重试
            </button>
          </div>
        </div>
      </Show>

      {/* 分析结果表格 */}
      <Show when={!store.loading() || store.analysisList().length > 0}>
        <AnalysisTable analysisList={store.analysisList()} />
      </Show>

      {/* 加载更多指示器 */}
      <Show when={store.loading() && store.analysisList().length > 0}>
        <div class="text-center py-6 mt-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p class="mt-2 text-sm text-gray-600">加载更多...</p>
        </div>
      </Show>

      {/* 没有更多数据提示 */}
      <Show when={!store.hasMore() && store.analysisList().length > 0}>
        <div class="text-center py-6 mt-4 text-gray-500 text-sm border-t">
          <svg class="w-6 h-6 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          已加载全部数据
        </div>
      </Show>
    </div>
  );
}     
