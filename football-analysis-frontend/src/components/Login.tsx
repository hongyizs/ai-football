import { createSignal } from 'solid-js';
import { AuthService } from '../services/auth';

interface LoginProps {
  onLoginSuccess: () => void;
}

/**
 * 登录组件
 */
export function Login(props: LoginProps) {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || '/foot';
  const authService = new AuthService(apiUrl);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await authService.login(username(), password());
      
      if (result.code === 0) {
        console.log('登录成功');
        props.onLoginSuccess();
      } else {
        setError(result.message || '登录失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
      console.error('登录错误:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {/* Logo/标题 */}
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-800">足球AI分析</h2>
          <p class="text-gray-600 mt-2">请登录以查看分析结果</p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} class="space-y-6">
          {/* 错误提示 */}
          {error() && (
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error()}
            </div>
          )}

          {/* 用户名 */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <input
              type="text"
              value={username()}
              onInput={(e) => setUsername(e.currentTarget.value)}
              placeholder="请输入用户名"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* 密码 */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="请输入密码"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={loading()}
            class="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {loading() ? (
              <>
                <div class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                登录中...
              </>
            ) : (
              '登录'
            )}
          </button>
        </form>

        {/* 提示信息 */}
        <div class="mt-6 text-center text-sm text-gray-600">
          <p>默认账号: admin</p>
          <p>默认密码: 123456</p>
        </div>
      </div>
    </div>
  );
}
