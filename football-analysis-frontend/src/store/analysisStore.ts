import { createSignal } from 'solid-js';
import type { AiAnalysisResult } from '../types';
import type { ApiService } from '../services/api';

/**
 * 创建分析结果状态管理
 */
export function createAnalysisStore() {
  const [analysisList, setAnalysisList] = createSignal<AiAnalysisResult[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [connected, setConnected] = createSignal(false);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [hasMore, setHasMore] = createSignal(true);

  /**
   * 添加新的分析结果到列表顶部
   */
  const addAnalysis = (analysis: AiAnalysisResult) => {
    setAnalysisList((prev) => [analysis, ...prev]);
  };

  /**
   * 加载初始数据
   */
  const loadInitialData = async (apiService: ApiService) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getAnalysisList(1, 20);
      
      if (response.code === 0 && response.data) {
        setAnalysisList(response.data.list || []);
        setCurrentPage(1);
        setHasMore(response.data.pageNo < response.data.pages);
      } else {
        setError(response.message || '加载失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
      console.error('加载初始数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 加载更多数据
   */
  const loadMore = async (apiService: ApiService) => {
    if (loading() || !hasMore()) {
      return;
    }

    const nextPage = currentPage() + 1;
    setLoading(true);

    try {
      const response = await apiService.getAnalysisList(nextPage, 20);
      
      if (response.code === 0 && response.data) {
        setAnalysisList((prev) => [...prev, ...(response.data.list || [])]);
        setCurrentPage(nextPage);
        setHasMore(response.data.pageNo < response.data.pages);
      }
    } catch (err) {
      console.error('加载更多失败:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 重试加载
   */
  const retry = async (apiService: ApiService) => {
    await loadInitialData(apiService);
  };

  return {
    analysisList,
    loading,
    error,
    connected,
    currentPage,
    hasMore,
    setConnected,
    addAnalysis,
    loadInitialData,
    loadMore,
    retry,
  };
}

export type AnalysisStore = ReturnType<typeof createAnalysisStore>;
