import { For, Show, createSignal } from 'solid-js';
import type { AiAnalysisResult } from '../types';
import { AnalysisDetailModal } from './AnalysisDetailModal';

interface AnalysisTableProps {
  analysisList: AiAnalysisResult[];
}

/**
 * 分析结果表格组件
 */
export function AnalysisTable(props: AnalysisTableProps) {
  const [selectedAnalysis, setSelectedAnalysis] = createSignal<AiAnalysisResult | null>(null);
  const [isModalOpen, setIsModalOpen] = createSignal(false);

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

  const handleRowClick = (analysis: AiAnalysisResult) => {
    setSelectedAnalysis(analysis);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAnalysis(null), 300);
  };

  return (
    <>
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  比赛时间
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  主队
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  VS
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客队
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  主胜
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  平局
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客胜
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI预测
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <For each={props.analysisList}>
                {(analysis) => (
                  <tr 
                    class="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(analysis)}
                  >
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {formatTime(analysis.matchTime)}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {analysis.homeTeam}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                      VS
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {analysis.awayTeam}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-center text-sm font-semibold text-green-600">
                      {analysis.homeWin}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-center text-sm font-semibold text-yellow-600">
                      {analysis.draw}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-center text-sm font-semibold text-blue-600">
                      {analysis.awayWin}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">
                      <div class="font-medium">{analysis.aiScore}</div>
                      <div class="text-xs text-gray-500">{analysis.aiResult}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-center text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(analysis);
                        }}
                        class="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>

        {/* 空状态 */}
        <Show when={props.analysisList.length === 0}>
          <div class="text-center py-12 text-gray-500">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="mt-2">暂无数据</p>
          </div>
        </Show>
      </div>

      {/* 详情弹窗 */}
      <Show when={selectedAnalysis()}>
        <AnalysisDetailModal
          analysis={selectedAnalysis()!}
          isOpen={isModalOpen()}
          onClose={handleCloseModal}
        />
      </Show>
    </>
  );
}
