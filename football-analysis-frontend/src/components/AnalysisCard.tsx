import type { AiAnalysisResult } from '../types';

interface AnalysisCardProps {
  analysis: AiAnalysisResult;
}

/**
 * 分析结果卡片组件
 * 展示单个比赛的AI分析结果
 */
export function AnalysisCard(props: AnalysisCardProps) {
  const formatTime = (time: string) => {
    try {
      return new Date(time).toLocaleString('zh-CN', {
        year: 'numeric',
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
    <div class="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      {/* 标题行 */}
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">
          {props.analysis.homeTeam} vs {props.analysis.awayTeam}
        </h3>
        <span class="text-gray-500 text-sm">
          {formatTime(props.analysis.matchTime)}
        </span>
      </div>

      {/* 胜平负概率 */}
      <div class="grid grid-cols-3 gap-4 mb-4">
        <div class="text-center">
          <div class="text-sm text-gray-600 mb-1">主胜</div>
          <div class="text-lg font-semibold text-green-600">
            {props.analysis.homeWin}
          </div>
        </div>
        <div class="text-center">
          <div class="text-sm text-gray-600 mb-1">平局</div>
          <div class="text-lg font-semibold text-yellow-600">
            {props.analysis.draw}
          </div>
        </div>
        <div class="text-center">
          <div class="text-sm text-gray-600 mb-1">客胜</div>
          <div class="text-lg font-semibold text-blue-600">
            {props.analysis.awayWin}
          </div>
        </div>
      </div>

      {/* AI预测 */}
      <div class="mb-3 p-3 bg-gray-50 rounded">
        <div class="text-sm font-semibold text-gray-700 mb-1">AI预测</div>
        <div class="text-base text-gray-800">
          <span class="mr-4">比分: {props.analysis.aiScore}</span>
          <span>结果: {props.analysis.aiResult}</span>
        </div>
      </div>

      {/* 分析详情 */}
      <div>
        <div class="text-sm font-semibold text-gray-700 mb-1">分析详情</div>
        <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
          {props.analysis.aiAnalysis}
        </p>
      </div>

      {/* 实际结果（如果有） */}
      {props.analysis.matchResult && (
        <div class="mt-3 pt-3 border-t border-gray-200">
          <div class="text-sm font-semibold text-gray-700 mb-1">实际结果</div>
          <div class="text-base text-gray-800">{props.analysis.matchResult}</div>
        </div>
      )}
    </div>
  );
}
