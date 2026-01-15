import type { AiAnalysisResult } from '../types';

interface AnalysisCardMobileProps {
  analysis: AiAnalysisResult;
  onClick: () => void;
}

/**
 * 移动端分析结果卡片组件
 */
export function AnalysisCardMobile(props: AnalysisCardMobileProps) {
  const formatTime = (time: string) => {
    try {
      return new Date(time).toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return time;
    }
  };

  return (
    <div
      class="bg-white rounded-lg shadow-md p-4 mb-3 active:shadow-lg transition-shadow cursor-pointer"
      onClick={props.onClick}
    >
      {/* 标题行 */}
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1">
          <h3 class="text-base font-bold text-gray-800 mb-1">
            {props.analysis.homeTeam} vs {props.analysis.awayTeam}
          </h3>
          <span class="text-xs text-gray-500">
            {formatTime(props.analysis.matchTime)}
          </span>
        </div>
        <button class="text-blue-600 text-sm font-medium ml-2 flex-shrink-0">
          详情 →
        </button>
      </div>

      {/* 胜平负概率 */}
      <div class="grid grid-cols-3 gap-2 mb-3">
        <div class="text-center bg-green-50 rounded p-2">
          <div class="text-xs text-green-700 mb-1">主胜</div>
          <div class="text-sm font-bold text-green-600">
            {props.analysis.homeWin}
          </div>
        </div>
        <div class="text-center bg-yellow-50 rounded p-2">
          <div class="text-xs text-yellow-700 mb-1">平局</div>
          <div class="text-sm font-bold text-yellow-600">
            {props.analysis.draw}
          </div>
        </div>
        <div class="text-center bg-blue-50 rounded p-2">
          <div class="text-xs text-blue-700 mb-1">客胜</div>
          <div class="text-sm font-bold text-blue-600">
            {props.analysis.awayWin}
          </div>
        </div>
      </div>

      {/* AI预测 */}
      <div class="bg-purple-50 rounded p-2">
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-600">AI预测:</span>
          <span class="font-semibold text-purple-600">
            {props.analysis.aiScore} - {props.analysis.aiResult}
          </span>
        </div>
      </div>
    </div>
  );
}
