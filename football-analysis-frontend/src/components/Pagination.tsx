import { For } from 'solid-js';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * 分页组件
 */
export function Pagination(props: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (props.totalPages <= maxVisible) {
      // 总页数少，显示所有页码
      for (let i = 1; i <= props.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 总页数多，显示部分页码
      if (props.currentPage <= 3) {
        // 当前页在前面
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(props.totalPages);
      } else if (props.currentPage >= props.totalPages - 2) {
        // 当前页在后面
        pages.push(1);
        pages.push('...');
        for (let i = props.totalPages - 4; i <= props.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push('...');
        for (let i = props.currentPage - 1; i <= props.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(props.totalPages);
      }
    }

    return pages;
  };

  return (
    <div class="flex items-center justify-center gap-2 py-4">
      {/* 上一页 */}
      <button
        onClick={() => props.onPageChange(props.currentPage - 1)}
        disabled={props.currentPage === 1}
        class="px-3 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        上一页
      </button>

      {/* 页码 */}
      <div class="flex gap-1">
        <For each={getPageNumbers()}>
          {(page) =>
            typeof page === 'number' ? (
              <button
                onClick={() => props.onPageChange(page)}
                class={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  page === props.currentPage
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ) : (
              <span class="px-3 py-2 text-gray-500">...</span>
            )
          }
        </For>
      </div>

      {/* 下一页 */}
      <button
        onClick={() => props.onPageChange(props.currentPage + 1)}
        disabled={props.currentPage === props.totalPages}
        class="px-3 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        下一页
      </button>
    </div>
  );
}
