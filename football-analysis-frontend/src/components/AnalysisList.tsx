import { Show, onMount, onCleanup, createSignal, For, createEffect } from 'solid-js';
import { AnalysisTable } from './AnalysisTable';
import { AnalysisCardMobile } from './AnalysisCardMobile';
import { AnalysisDetailModal } from './AnalysisDetailModal';
import { createAnalysisStore } from '../store/analysisStore';
import { WebSocketService } from '../services/websocket';
import { ApiService } from '../services/api';
import { AuthService } from '../services/auth';
import type { AiAnalysisResult } from '../types';

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

  // 状态管理
  const [isWsConnected, setIsWsConnected] = createSignal(false);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [pageSize] = createSignal(20);
  const [dateFilter, setDateFilter] = createSignal('');
  const [isMobile, setIsMobile] = createSignal(false);
  const [selectedAnalysis, setSelectedAnalysis] = createSignal<AiAnalysisResult | null>(null);
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  // 检测移动端
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  onMount(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
  });

  // 登出处理
  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  // WebSocket连接控制
  const handleWsToggle = () => {
    if (isWsConnected()) {
      wsService.disconnect();
      setIsWsConnected(false);
    } else {
      const token = authService.getToken();
      if (token) {
        wsService.setToken(token);
      }
      wsService.connect();
      setIsWsConnected(true);
    }
  };

  onMount(async () => {
    // 加载初始数据
    await store.loadInitialData(apiService);

    // 清理函数
    onCleanup(() => {
      if (isWsConnected()) {
        wsService.disconnect();
      }
      window.removeEventListener('resize', checkMobile);
    });
  });

  // 监听WebSocket消息
  createEffect(() => {
    if (isWsConnected()) {
      const unsubscribe = wsService.subscribe((data) => {
        console.log('收到新的分析结果:', data);
        store.addAnalysis(data);
      });

      onCleanup(() => {
        unsubscribe();
      });
    }
  });

  // 过滤和分页数据
  const filteredList = () => {
    let list = store.analysisList();
    
    // 日期筛选
    if (dateFilter()) {
      const filterDate = new Date(dateFilter()).toDateString();
      list = list.filter(item => {
        const itemDate = new Date(item.matchTime).toDateString();
        return itemDate === filterDate;
      });
    }
    
    return list;
  };

  const paginatedList = () => {
    const list = filteredList();
    const start = (currentPage() - 1) * pageSize();
    const end = start + pageSize();
    return list.slice(start, end);
  };

  const totalPages = () => {
    return Math.ceil(filteredList().length / pageSize());
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDateFilterChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setDateFilter(target.value);
    setCurrentPage(1); // 重置到第一页
  };

  const clearDateFilter = () => {
    setDateFilter('');
    setCurrentPage(1);
  };

  const handleRowClick = (analysis: AiAnalysisResult) => {
    setSelectedAnalysis(analysis);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAnalysis(null), 300);
  };

  return (
    <div class="container mx-auto px-4 py-6 max-w-7xl min-h-screen">
      {/* 头部 */}
      <div class="mb-6 sticky top-0 bg-white z-10 pb-4 border-b shadow-sm">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold mb-2 text-gray-800">⚽ 足球AI分析系统</h1>
            <div class="flex items-center gap-4 flex-wrap">
              <div class="flex items-center gap-2">
                <div
                  class={`w-3 h-3 rounded-full ${
                    isWsConnected() ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}
                />
                <span class="text-sm text-gray-600">
                  {isWsConnected() ? '实时连接' : '未连接'}
                </span>
              </div>
              <div class="text-sm text-gray-600">
                共 {filteredList().length} 条数据
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              onClick={handleWsToggle}
              class={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                isWsConnected()
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isWsConnected() ? (
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                ) : (
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                )}
              </svg>
              {isWsConnected() ? '断开连接' : '连接实时'}
            </button>
            <button
              onClick={handleLogout}
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              退出
            </button>
          </div>
        </div>

        {/* 筛选栏 */}
        <div class="mt-4 flex flex-col md:flex-row gap-3">
          <div class="flex-1 flex items-center gap-2">
            <label class="text-sm text-gray-600 whitespace-nowrap">日期筛选:</label>
            <input
              type="date"
              value={dateFilter()}
              onInput={handleDateFilterChange}
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <Show when={dateFilter()}>
              <button
                onClick={clearDateFilter}
                class="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition-colors"
              >
                清除
              </button>
            </Show>
          </div>
          <div class="text-sm text-gray-600 flex items-center">
            第 {currentPage()} / {totalPages() || 1} 页
          </div>
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

      {/* 桌面端：表格视图 */}
      <Show when={!isMobile() && (!store.loading() || store.analysisList().length > 0)}>
        <AnalysisTable
          analysisList={paginatedList()}
          currentPage={currentPage()}
          totalPages={totalPages()}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />
      </Show>

      {/* 移动端：卡片视图 */}
      <Show when={isMobile() && (!store.loading() || store.analysisList().length > 0)}>
        <div class="space-y-3">
          <For each={paginatedList()}>
            {(analysis) => (
              <AnalysisCardMobile
                analysis={analysis}
                onClick={() => handleRowClick(analysis)}
              />
            )}
          </For>
        </div>

        {/* 移动端分页 */}
        <Show when={totalPages() > 1}>
          <div class="mt-4">
            <div class="flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage() - 1)}
                disabled={currentPage() === 1}
                class="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span class="px-4 py-2 text-sm text-gray-600">
                {currentPage()} / {totalPages()}
              </span>
              <button
                onClick={() => handlePageChange(currentPage() + 1)}
                disabled={currentPage() === totalPages()}
                class="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        </Show>
      </Show>

      {/* 详情弹窗 */}
      <Show when={selectedAnalysis()}>
        <AnalysisDetailModal
          analysis={selectedAnalysis()!}
          isOpen={isModalOpen()}
          onClose={handleCloseModal}
        />
      </Show>
    </div>
  );
}
