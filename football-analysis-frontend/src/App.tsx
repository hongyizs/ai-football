import { createSignal, onMount, Show } from 'solid-js';
import { AnalysisList } from './components/AnalysisList';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Login } from './components/Login';
import { AuthService } from './services/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [checking, setChecking] = createSignal(true);

  // 开发环境使用代理路径，生产环境使用完整URL
  const apiUrl = import.meta.env.VITE_API_URL || '/foot';
  const authService = new AuthService(apiUrl);

  onMount(async () => {
    // 检查是否已登录
    const authenticated = authService.isAuthenticated();
    
    if (authenticated) {
      // 验证token是否有效
      const valid = await authService.verifyToken();
      setIsAuthenticated(valid);
      
      if (!valid) {
        // Token无效，清除认证信息
        authService.logout();
      }
    }
    
    setChecking(false);
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <ErrorBoundary>
      <Show
        when={!checking()}
        fallback={
          <div class="min-h-screen flex-1 flex items-center justify-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        }
      >
        <Show
          when={isAuthenticated()}
          fallback={<Login onLoginSuccess={handleLoginSuccess} />}
        >
          <AnalysisList />
        </Show>
      </Show>
    </ErrorBoundary>
  );
}

export default App;
