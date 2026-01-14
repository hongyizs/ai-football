import { createSignal, ErrorBoundary as SolidErrorBoundary } from 'solid-js';
import type { JSX } from 'solid-js';

interface ErrorBoundaryProps {
  children: JSX.Element;
}

/**
 * 错误边界组件
 * 捕获组件渲染错误并显示友好的错误信息
 */
export function ErrorBoundary(props: ErrorBoundaryProps) {
  const [retryCount, setRetryCount] = createSignal(0);

  const handleRetry = () => {
    setRetryCount(retryCount() + 1);
    window.location.reload();
  };

  return (
    <SolidErrorBoundary
      fallback={(err, reset) => (
        <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 class="mt-4 text-xl font-bold text-center text-gray-800">
              出错了
            </h2>

            <p class="mt-2 text-sm text-center text-gray-600">
              应用程序遇到了一个错误。请尝试刷新页面。
            </p>

            <div class="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-700 font-mono overflow-auto max-h-32">
              {err.toString()}
            </div>

            <div class="mt-6 flex gap-3">
              <button
                onClick={reset}
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                重试
              </button>
              <button
                onClick={handleRetry}
                class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                刷新页面
              </button>
            </div>
          </div>
        </div>
      )}
    >
      {props.children}
    </SolidErrorBoundary>
  );
}
