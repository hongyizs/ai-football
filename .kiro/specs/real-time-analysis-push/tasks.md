# Implementation Plan: Real-Time Analysis Push

## Overview

本实施计划将实时分析推送功能分解为可执行的编码任务。实施分为后端和前端两部分，后端使用Java/Spring Boot实现WebSocket服务和REST API，前端使用TypeScript/SolidJS构建现代化单页应用。每个任务都包含具体的实现步骤和需求引用。

## Tasks

- [ ] 1. 后端WebSocket基础设施搭建
  - [x] 1.1 添加Spring WebSocket依赖并配置WebSocket端点
    - 在pom.xml中添加spring-boot-starter-websocket依赖
    - 创建WebSocketConfig配置类，注册/ws/analysis端点
    - 配置CORS允许前端跨域连接
    - _Requirements: 1.1_

  - [ ]* 1.2 编写WebSocketConfig配置类的单元测试
    - 测试WebSocket端点注册
    - 测试CORS配置
    - _Requirements: 1.1_

- [ ] 2. 实现WebSocket消息处理器
  - [x] 2.1 创建AnalysisWebSocketHandler类
    - 继承TextWebSocketHandler
    - 实现连接建立、关闭和消息处理方法
    - 使用线程安全的Set维护活动会话
    - 实现broadcast方法向所有连接推送消息
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

  - [ ]* 2.2 编写WebSocket处理器的属性测试
    - **Property 1: WebSocket消息广播完整性**
    - **Validates: Requirements 1.4**
    - 使用jqwik生成随机会话集合和消息
    - 验证所有打开的会话都接收到消息
    - _Requirements: 1.4_

  - [ ]* 2.3 编写WebSocket连接管理的属性测试
    - **Property 2: WebSocket连接状态一致性**
    - **Validates: Requirements 1.5**
    - 验证关闭的连接从集合中移除
    - 验证关闭的连接不再接收消息
    - _Requirements: 1.5_

  - [ ]* 2.4 编写错误处理的单元测试
    - 测试推送失败时的错误处理
    - 验证单个连接失败不影响其他连接
    - _Requirements: 1.6_

- [ ] 3. 实现REST API端点
  - [x] 3.1 创建AnalysisResultRestController
    - 实现GET /api/analysis/list分页查询接口
    - 实现GET /api/analysis/{id}单条查询接口
    - 使用MyBatis Plus进行数据库查询
    - 返回统一的ApiResponse格式
    - _Requirements: 5.2, 5.3, 5.4_

  - [ ]* 3.2 编写REST API的单元测试
    - 测试分页查询功能
    - 测试单条查询功能
    - 测试数据不存在的情况
    - _Requirements: 5.2, 5.3_

  - [ ]* 3.3 编写分页查询顺序的属性测试
    - **Property 5: 历史数据分页查询顺序**
    - **Validates: Requirements 5.4**
    - 生成随机数据集并保存
    - 验证查询结果按创建时间降序排列
    - _Requirements: 5.4_

- [ ] 4. 集成定时任务与WebSocket推送
  - [x] 4.1 修改现有定时任务，添加WebSocket推送逻辑
    - 在定时任务完成后注入AnalysisWebSocketHandler
    - 保存数据到数据库后调用broadcast方法
    - 添加推送成功/失败的日志记录
    - _Requirements: 1.3, 1.4_

  - [ ]* 4.2 编写数据序列化的属性测试
    - **Property 4: 数据序列化往返一致性**
    - **Validates: Requirements 1.3**
    - 生成随机AiAnalysisResult对象
    - 验证JSON序列化后反序列化得到等价对象
    - _Requirements: 1.3_

- [ ] 5. 后端配置和错误处理
  - [x] 5.1 在application.yml中添加WebSocket配置
    - 配置WebSocket端口和路径
    - 配置最大连接数限制
    - 配置分页查询默认大小
    - _Requirements: 8.1, 8.2, 8.5_

  - [ ]* 5.2 编写配置参数验证的属性测试
    - **Property 8: 配置参数有效性**
    - **Validates: Requirements 8.2**
    - 验证配置值在合理范围内
    - _Requirements: 8.2_

  - [x] 5.3 实现全局异常处理器
    - 捕获WebSocket异常并记录日志
    - 捕获数据库异常并返回友好错误
    - 捕获JSON序列化异常
    - _Requirements: 7.4, 7.5_

- [ ] 6. Checkpoint - 后端功能验证
  - 确保所有后端测试通过
  - 手动测试WebSocket连接和推送
  - 验证REST API返回正确数据
  - 如有问题请询问用户

- [ ] 7. 前端项目初始化
  - [x] 7.1 使用Vite创建SolidJS项目
    - 运行`npm create vite@latest football-analysis-frontend -- --template solid-ts`
    - 安装基础依赖
    - 配置TypeScript编译选项
    - _Requirements: 2.1, 2.2, 2.5_

  - [x] 7.2 安装和配置UnoCSS
    - 安装unocss和@unocss/preset-uno
    - 创建uno.config.ts配置文件
    - 在main.tsx中导入virtual:uno.css
    - _Requirements: 2.3_

  - [x] 7.3 配置自动导入插件
    - 安装unplugin-auto-import
    - 配置自动导入SolidJS API
    - 配置自动导入组件
    - _Requirements: 2.4_

  - [x] 7.4 配置环境变量
    - 创建.env.development和.env.production文件
    - 配置VITE_API_URL和VITE_WS_URL
    - _Requirements: 8.3_

- [ ] 8. 实现前端类型定义
  - [x] 8.1 创建types/index.ts定义数据类型
    - 定义AiAnalysisResult接口
    - 定义ApiResponse接口
    - 定义PageResponse接口
    - _Requirements: 5.1, 5.5_

- [ ] 9. 实现WebSocket服务
  - [x] 9.1 创建services/websocket.ts实现WebSocketService类
    - 实现connect方法建立连接
    - 实现消息接收和分发机制
    - 实现自动重连逻辑（指数退避）
    - 实现订阅/取消订阅机制
    - 实现disconnect方法
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 9.2 编写WebSocket自动重连的属性测试
    - **Property 3: 前端WebSocket自动重连**
    - **Validates: Requirements 3.4**
    - 生成随机最大重试次数
    - 模拟连接断开
    - 验证重连次数不超过最大限制
    - _Requirements: 3.4_

  - [ ]* 9.3 编写WebSocket服务的单元测试
    - 测试连接建立
    - 测试消息接收
    - 测试订阅机制
    - 测试连接关闭
    - _Requirements: 3.1, 3.2, 3.3, 3.6_

- [ ] 10. 实现HTTP API服务
  - [x] 10.1 创建services/api.ts实现ApiService类
    - 实现getAnalysisList方法（分页查询）
    - 实现getAnalysisById方法（单条查询）
    - 实现错误处理和重试逻辑
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 10.2 编写API服务的单元测试
    - 测试HTTP请求
    - 测试错误处理
    - 测试响应解析
    - _Requirements: 5.1, 7.2_

- [ ] 11. 实现状态管理
  - [x] 11.1 创建store/analysisStore.ts实现状态管理
    - 使用createSignal创建响应式状态
    - 实现analysisList、loading、error、connected状态
    - 实现addAnalysis方法（添加到列表顶部）
    - 实现loadInitialData方法
    - 实现loadMore方法（分页加载）
    - _Requirements: 4.1, 4.3, 5.1, 5.5, 5.6_

  - [ ]* 11.2 编写状态管理的属性测试
    - **Property 6: 新数据添加到列表顶部**
    - **Validates: Requirements 4.3**
    - 生成随机初始列表和新数据
    - 验证新数据总是在第一个位置
    - _Requirements: 4.3_

  - [ ]* 11.3 编写状态管理的单元测试
    - 测试状态初始化
    - 测试数据加载
    - 测试错误处理
    - _Requirements: 4.1, 5.1_

- [ ] 12. 实现AnalysisCard组件
  - [x] 12.1 创建components/AnalysisCard.tsx
    - 接收analysis prop
    - 展示主队、客队、比赛时间
    - 展示胜平负概率（使用视觉化展示）
    - 展示AI预测比分和结果
    - 展示AI分析内容
    - 使用UnoCSS样式
    - _Requirements: 4.2, 6.5_

  - [ ]* 12.2 编写AnalysisCard组件测试
    - 测试组件渲染
    - 测试数据展示
    - 测试时间格式化
    - _Requirements: 4.2, 6.4_

- [ ] 13. 实现AnalysisList主组件
  - [x] 13.1 创建components/AnalysisList.tsx
    - 使用analysisStore管理状态
    - 在onMount中初始化WebSocket和加载数据
    - 显示连接状态指示器
    - 显示加载状态
    - 显示错误提示
    - 显示空状态
    - 使用For循环渲染AnalysisCard列表
    - 实现滚动加载更多
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.6, 5.6_

  - [ ]* 13.2 编写AnalysisList组件集成测试
    - 测试数据加载
    - 测试WebSocket连接
    - 测试新数据接收
    - 测试错误处理
    - _Requirements: 4.1, 4.3, 7.1, 7.2_

- [ ] 14. 实现响应式布局
  - [x] 14.1 在AnalysisList和AnalysisCard中添加响应式样式
    - 使用UnoCSS的响应式断点
    - 桌面端多列布局
    - 移动端单列布局
    - 添加过渡动画
    - _Requirements: 6.1, 6.2, 6.3, 6.6_

  - [ ]* 14.2 编写响应式布局测试
    - 测试不同屏幕尺寸下的布局
    - 测试样式应用
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 15. 实现错误处理和用户反馈
  - [x] 15.1 创建ErrorBoundary组件
    - 捕获组件渲染错误
    - 显示友好的错误信息
    - 提供重试选项
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 15.2 在AnalysisList中添加错误处理UI
    - WebSocket连接失败提示
    - API请求失败提示
    - 重试按钮
    - _Requirements: 7.1, 7.2_

  - [ ]* 15.3 编写错误处理的单元测试
    - 测试ErrorBoundary
    - 测试错误提示显示
    - 测试重试功能
    - _Requirements: 7.1, 7.2, 7.3_

- [ ] 16. 配置前端构建和部署
  - [x] 16.1 配置vite.config.ts
    - 配置代理转发API请求（开发环境）
    - 配置构建输出目录
    - 配置生产环境优化
    - _Requirements: 2.6, 8.3_

  - [x] 16.2 创建README.md文档
    - 说明项目结构
    - 说明如何启动开发服务器
    - 说明如何构建生产版本
    - 说明环境变量配置
    - _Requirements: 8.3, 8.4_

- [ ] 17. Final Checkpoint - 端到端测试
  - 启动后端服务
  - 启动前端开发服务器
  - 验证WebSocket连接成功
  - 触发定时任务，验证前端接收到推送
  - 验证历史数据加载
  - 验证响应式布局
  - 验证错误处理
  - 确保所有测试通过
  - 如有问题请询问用户

## Notes

- 标记`*`的任务为可选测试任务，可以跳过以加快MVP开发
- 每个任务都引用了具体的需求编号以确保可追溯性
- 属性测试使用jqwik（Java）和fast-check（TypeScript），每个测试至少运行100次迭代
- 单元测试用于验证具体示例和边界情况
- 集成测试验证组件间的协作
- Checkpoint任务确保增量验证和及时发现问题
