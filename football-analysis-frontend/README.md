# 足球AI分析前端

基于 Vite + SolidJS + UnoCSS 构建的现代化足球AI分析结果展示应用。

## 技术栈

- **Vite 7.x** - 快速的构建工具
- **SolidJS 1.x** - 高性能的响应式UI框架
- **TypeScript 5.x** - 类型安全
- **UnoCSS** - 原子化CSS引擎
- **unplugin-auto-import** - 自动导入插件

## 功能特性

- ✅ 实时WebSocket连接，接收最新的AI分析结果
- ✅ 分页加载历史分析数据
- ✅ 响应式设计，支持桌面和移动设备
- ✅ 自动重连机制
- ✅ 错误处理和友好的用户提示
- ✅ 滚动加载更多数据

## 项目结构

```
football-analysis-frontend/
├── src/
│   ├── components/          # UI组件
│   │   ├── AnalysisCard.tsx    # 分析结果卡片
│   │   ├── AnalysisList.tsx    # 分析结果列表
│   │   └── ErrorBoundary.tsx   # 错误边界
│   ├── services/            # 服务层
│   │   ├── api.ts              # HTTP API服务
│   │   └── websocket.ts        # WebSocket服务
│   ├── store/               # 状态管理
│   │   └── analysisStore.ts    # 分析结果状态
│   ├── types/               # 类型定义
│   │   └── index.ts            # 数据类型
│   ├── App.tsx              # 根组件
│   └── index.tsx            # 入口文件
├── .env.development         # 开发环境配置
├── .env.production          # 生产环境配置
├── uno.config.ts            # UnoCSS配置
├── vite.config.ts           # Vite配置
└── package.json
```

## 环境变量配置

### 开发环境 (`.env.development`)

```env
VITE_API_URL=http://localhost:9000/foot
VITE_WS_URL=ws://localhost:9000/foot/ws/analysis
```

### 生产环境 (`.env.production`)

```env
VITE_API_URL=http://your-production-domain.com/foot
VITE_WS_URL=ws://your-production-domain.com/foot/ws/analysis
```

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

应用将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
pnpm build
```

构建产物将输出到 `dist/` 目录。

### 预览生产构建

```bash
pnpm preview
```

## API接口

### REST API

- `GET /api/analysis/list?page=1&size=20` - 获取分析结果列表（分页）
- `GET /api/analysis/{id}` - 获取单个分析结果

### WebSocket

- `ws://localhost:9000/foot/ws/analysis` - 实时推送新的分析结果

## 数据格式

### AiAnalysisResult

```typescript
interface AiAnalysisResult {
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
```

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

MIT
