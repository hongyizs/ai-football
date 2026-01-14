import { Show } from 'solid-js';
import type { AiAnalysisResult } from '../types';

interface AnalysisDetailModalProps {
  analysis: AiAnalysisResult;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 分析详情弹窗组件
 */
export function AnalysisDetailModal(props: AnalysisDetailModalProps) {
  const formatTime = (time: string) => {
    try {
      return new Date(time).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return time;
    }
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      {/* 背景遮罩 */}
      <div
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={handleBackdropClick}
      >
        {/* 弹窗内容 */}
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
          {/* 头部 */}
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-white">
              {props.analysis.homeTeam} vs {props.analysis.awayTeam}
            </h2>
            <button
              onClick={props.onClose}
              class="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 内容区域 */}
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* 基本信息 */}
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                基本信息
              </h3>
              <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <span class="text-sm text-gray-600">比赛ID:</span>
                  <span class="ml-2 text-sm font-medium text-gray-900">{props.analysis.matchId}</span>
                </div>
                <div>
                  <span class="text-sm text-gray-600">比赛时间:</span>
                  <span class="ml-2 text-sm font-medium text-gray-900">{formatTime(props.analysis.matchTime)}</span>
                </div>
                <div>
                  <span class="text-sm text-gray-600">创建时间:</span>
                  <span class="ml-2 text-sm font-medium text-gray-900">{formatTime(props.analysis.createTime)}</span>
                </div>
              </div>
            </div>

            {/* 胜平负概率 */}
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                胜平负概率
              </h3>
              <div class="grid grid-cols-3 gap-4">
                <div class="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                  <div class="text-sm text-green-700 font-medium mb-2">主队胜</div>
                  <div class="text-3xl font-bold text-green-600">{props.analysis.homeWin}</div>
                  <div class="text-xs text-green-600 mt-1">{props.analysis.homeTeam}</div>
                </div>
                <div class="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
                  <div class="text-sm text-yellow-700 font-medium mb-2">平局</div>
                  <div class="text-3xl font-bold text-yellow-600">{props.analysis.draw}</div>
                  <div class="text-xs text-yellow-600 mt-1">Draw</div>
                </div>
                <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                  <div class="text-sm text-blue-700 font-medium mb-2">客队胜</div>
                  <div class="text-3xl font-bold text-blue-600">{props.analysis.awayWin}</div>
                  <div class="text-xs text-blue-600 mt-1">{props.analysis.awayTeam}</div>
                </div>
              </div>
            </div>

            {/* AI预测 */}
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI预测结果
              </h3>
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <span class="text-sm text-gray-600">预测比分:</span>
                    <span class="ml-2 text-xl font-bold text-purple-600">{props.analysis.aiScore}</span>
                  </div>
                  <div>
                    <span class="text-sm text-gray-600">预测结果:</span>
                    <span class="ml-2 text-xl font-bold text-purple-600">{props.analysis.aiResult}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI分析详情 */}
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                AI分析详情
              </h3>
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p class="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {props.analysis.aiAnalysis}
                </p>
              </div>
            </div>

            {/* 实际结果（如果有） */}
            <Show when={props.analysis.matchResult}>
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  实际结果
                </h3>
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p class="text-gray-700 font-medium">{props.analysis.matchResult}</p>
                </div>
              </div>
            </Show>

            {/* 赛后分析（如果有） */}
            <Show when={props.analysis.afterMatchAnalysis}>
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  赛后分析
                </h3>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p class="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                    {props.analysis.afterMatchAnalysis}
                  </p>
                </div>
              </div>
            </Show>
          </div>

          {/* 底部按钮 */}
          <div class="bg-gray-50 px-6 py-4 flex justify-end border-t">
            <button
              onClick={props.onClose}
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
