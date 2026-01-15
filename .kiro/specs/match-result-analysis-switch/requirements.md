# Requirements Document

## Introduction

本需求旨在优化足球比赛分析系统的AI分析逻辑。当系统查询到比赛已有结果（matchResult）时，应该执行赛后复盘分析（afterMatchAnalysis）而非赛前预测分析（analyzeMatch），以提供更有价值的分析内容。

## Glossary

- **System**: 足球分析系统（Football Analysis System）
- **Match_Result**: 比赛结果数据，包含最终比分和胜负信息
- **AI_Analysis**: AI赛前预测分析功能，通过analyzeMatch方法实现
- **After_Match_Analysis**: AI赛后复盘分析功能，通过afterMatchAnalysis方法实现
- **Analysis_Service**: FootballAnalysisService服务类，负责比赛分析流程编排
- **AI_Service**: AIService服务类，提供AI分析能力

## Requirements

### Requirement 1: 比赛结果检测

**User Story:** 作为系统开发者，我希望在分析比赛前检测比赛是否已有结果，以便选择合适的分析方式。

#### Acceptance Criteria

1. WHEN THE System查询比赛信息时，THE System SHALL检查该比赛是否存在matchResult数据
2. WHEN matchResult数据存在且非空时，THE System SHALL标记该比赛为"已完赛"状态
3. WHEN matchResult数据不存在或为空时，THE System SHALL标记该比赛为"未完赛"状态

### Requirement 2: 分析方法路由

**User Story:** 作为系统开发者，我希望根据比赛状态选择不同的分析方法，以便提供更准确的分析内容。

#### Acceptance Criteria

1. WHEN 比赛标记为"已完赛"状态时，THE System SHALL调用afterMatchAnalysis方法进行赛后复盘
2. WHEN 比赛标记为"未完赛"状态时，THE System SHALL调用analyzeMatch方法进行赛前预测
3. WHEN 调用afterMatchAnalysis方法时，THE System SHALL传递比赛ID和比赛结果数据
4. WHEN 分析方法执行完成时，THE System SHALL返回分析结果文本

### Requirement 3: 赛后复盘分析

**User Story:** 作为系统用户，我希望对已完赛的比赛进行复盘分析，以便了解预测的准确性和改进方向。

#### Acceptance Criteria

1. WHEN afterMatchAnalysis方法被调用时，THE System SHALL查询该比赛的赛前分析内容
2. WHEN afterMatchAnalysis方法被调用时，THE System SHALL获取比赛的最终结果
3. WHEN 生成复盘分析时，THE System SHALL对比赛前预测与实际结果进行对比
4. WHEN 生成复盘分析时，THE System SHALL分析预测偏差的原因
5. WHEN 生成复盘分析时，THE System SHALL提出改进建议

### Requirement 4: 数据持久化

**User Story:** 作为系统开发者，我希望将赛后复盘分析结果保存到数据库，以便后续查询和统计。

#### Acceptance Criteria

1. WHEN afterMatchAnalysis方法执行完成时，THE System SHALL将复盘分析结果保存到AiAnalysisResult表的afterMatchAnalysis字段
2. WHEN 保存复盘分析结果时，THE System SHALL更新对应matchId的记录
3. WHEN 数据库操作失败时，THE System SHALL记录错误日志并返回错误信息

### Requirement 5: 向后兼容性

**User Story:** 作为系统维护者，我希望新功能不影响现有的赛前分析流程，以便保持系统稳定性。

#### Acceptance Criteria

1. WHEN 比赛未完赛时，THE System SHALL继续使用原有的analyzeMatch流程
2. WHEN 系统无法判断比赛状态时，THE System SHALL默认使用analyzeMatch方法
3. WHEN 新功能出现异常时，THE System SHALL降级到原有分析流程并记录警告日志
