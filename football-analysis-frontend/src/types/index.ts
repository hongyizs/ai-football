/**
 * AI分析结果数据类型
 */
export interface AiAnalysisResult {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  matchTime: string;
  homeWin: string;
  draw: string;
  awayWin: string;
  aiAnalysis: string;
  aiScore: string;
  aiResult: string;
  matchResult?: string;
  afterMatchAnalysis?: string;
  createTime: string;
}

/**
 * API响应类型
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

/**
 * 分页响应类型
 */
export interface PageResponse<T> {
  pageSize: number;
  pageNo: number;
  pages: number;
  total: number;
  list: T[];
}
