# Implementation Plan: Match Result Analysis Switch

## Overview

本实现计划将在足球分析系统中添加基于比赛状态的智能分析路由功能。主要工作包括：修改 `FootballAnalysisService` 添加状态检测逻辑，在 `AIService` 中实现单场赛后复盘方法，以及添加相应的测试用例。

## Tasks

- [x] 1. 在AIService中实现单场赛后复盘方法
  - [x] 1.1 实现 `afterMatchAnalysis(String matchId, String matchResult)` 方法
    - 添加方法签名和参数验证
    - 实现查询赛前分析结果的逻辑
    - 调用 `buildAfterAnalysisPrompt` 构建提示词
    - 调用 `assistant.chatV2()` 获取复盘分析
    - 添加日志记录
    - 返回分析结果文本
    - _Requirements: 3.1, 3.2, 2.3_

  - [ ]* 1.2 编写单场复盘方法的单元测试
    - 测试正常流程：传入有效的matchId和matchResult
    - 测试异常情况：matchId不存在
    - 测试异常情况：AI服务调用失败
    - 验证日志记录
    - _Requirements: 3.1, 3.2_

- [x] 2. 在FootballAnalysisService中添加状态检测和路由逻辑
  - [x] 2.1 重构 `analyzeSingleMatch` 方法添加状态检测
    - 保留现有的matchId查询逻辑
    - 添加matchResult状态检测逻辑
    - 根据状态调用不同的分析方法
    - 添加日志记录关键决策点
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2_

  - [x] 2.2 实现 `performAfterMatchAnalysis` 方法
    - 创建新方法接收 SubMatchInfo 和 AiAnalysisResultVo
    - 构建 MatchAnalysis 对象
    - 调用 `AIService.afterMatchAnalysis()` 获取复盘分析
    - 设置分析结果和时间戳
    - 保存分析结果到数据库
    - 返回 MatchAnalysis 对象
    - _Requirements: 2.1, 2.3, 2.4, 4.1, 4.2_

  - [x] 2.3 提取 `performPreMatchAnalysis` 方法
    - 将现有的赛前分析逻辑提取到新方法
    - 保持原有功能不变
    - 确保向后兼容性
    - _Requirements: 5.1_

  - [ ]* 2.4 编写状态检测和路由的单元测试
    - 测试matchResult存在且非空的情况
    - 测试matchResult为null的情况
    - 测试matchResult为空字符串的情况
    - 验证正确的方法被调用
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2_

- [x] 3. 添加错误处理和降级逻辑
  - [x] 3.1 在 `performAfterMatchAnalysis` 中添加异常处理
    - 捕获AI服务调用异常
    - 捕获数据库操作异常
    - 实现降级到赛前分析的逻辑
    - 添加ERROR和WARN级别日志
    - _Requirements: 4.3, 5.3_

  - [x] 3.2 在 `analyzeSingleMatch` 中添加默认行为
    - 处理无法判断状态的情况
    - 默认使用赛前分析方法
    - 添加WARN级别日志
    - _Requirements: 5.2_

  - [ ]* 3.3 编写错误处理的单元测试
    - 测试AI服务调用失败的降级
    - 测试数据库操作失败的处理
    - 测试无法判断状态的默认行为
    - 验证日志记录
    - _Requirements: 4.3, 5.2, 5.3_

- [x] 4. 更新MatchAnalysis DTO
  - [x] 4.1 在MatchAnalysis类中添加新字段
    - 添加 `isMatchFinished` 字段（boolean）
    - 添加 `matchResult` 字段（String）
    - 添加 `analysisType` 字段（String）
    - 更新Builder模式支持新字段
    - _Requirements: 2.1, 2.2_

- [x] 5. Checkpoint - 确保所有测试通过
  - 运行所有单元测试
  - 检查代码覆盖率
  - 确认日志输出正确
  - 如有问题，询问用户

- [ ] 6. 编写属性测试
  - [ ]* 6.1 编写Property 1测试：Match Result Detection
    - **Property 1: Match Result Detection**
    - **Validates: Requirements 1.1, 1.2, 1.3**
    - 生成随机比赛数据
    - 验证matchResult检测逻辑的正确性

  - [ ]* 6.2 编写Property 2测试：Analysis Method Routing
    - **Property 2: Analysis Method Routing**
    - **Validates: Requirements 2.1, 2.2**
    - 生成已完赛和未完赛的比赛数据
    - 验证方法路由的正确性

  - [ ]* 6.3 编写Property 3测试：After Match Analysis Parameters
    - **Property 3: After Match Analysis Parameters**
    - **Validates: Requirements 2.3**
    - 验证afterMatchAnalysis方法的参数传递

  - [ ]* 6.4 编写Property 4测试：Analysis Result Return
    - **Property 4: Analysis Result Return**
    - **Validates: Requirements 2.4**
    - 验证所有分析方法都返回非空结果

  - [ ]* 6.5 编写Property 6测试：Analysis Result Persistence
    - **Property 6: Analysis Result Persistence**
    - **Validates: Requirements 4.1, 4.2**
    - 验证复盘分析结果的持久化

  - [ ]* 6.6 编写Property 8测试：Backward Compatibility
    - **Property 8: Backward Compatibility**
    - **Validates: Requirements 5.1**
    - 验证未完赛比赛的处理与原有逻辑一致

  - [ ]* 6.7 编写Property 10测试：Graceful Degradation
    - **Property 10: Graceful Degradation**
    - **Validates: Requirements 5.3**
    - 验证异常情况下的降级策略

- [x] 7. 集成测试和验证
  - [ ]* 7.1 编写端到端集成测试
    - 测试完整的已完赛比赛分析流程
    - 测试完整的未完赛比赛分析流程
    - 验证数据库记录的正确性
    - _Requirements: 所有需求_

  - [x] 7.2 手动测试验证
    - 使用真实比赛数据测试
    - 验证AI复盘分析的质量
    - 检查日志输出
    - 确认前端展示正常

- [x] 8. Final Checkpoint - 确保所有测试通过
  - 运行所有单元测试和属性测试
  - 运行集成测试
  - 检查代码质量和覆盖率
  - 如有问题，询问用户

## Notes

- 任务标记 `*` 的为可选任务，可以跳过以加快MVP开发
- 每个任务都引用了具体的需求编号以便追溯
- Checkpoint任务确保增量验证
- 属性测试验证通用正确性属性
- 单元测试验证具体示例和边界情况
