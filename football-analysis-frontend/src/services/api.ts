import type { AiAnalysisResult, ApiResponse, PageResponse } from '../types';

/**
 * API服务类
 * 封装HTTP请求
 */
export class ApiService {
  constructor(private baseUrl: string) {}

  /**
   * 获取分析结果列表（分页）
   * @param page 页码
   * @param size 每页大小
   * @returns 分页结果
   */
  async getAnalysisList(
    page: number = 1,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<AiAnalysisResult>>> {
    const response = await fetch(
      `${this.baseUrl}/api/analysis/list?page=${page}&size=${size}`
    );

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 根据ID获取单个分析结果
   * @param id 分析结果ID
   * @returns 分析结果
   */
  async getAnalysisById(id: string): Promise<ApiResponse<AiAnalysisResult>> {
    const response = await fetch(`${this.baseUrl}/api/analysis/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    return response.json();
  }
}
