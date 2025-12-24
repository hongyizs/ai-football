# AI Football Predictor ⚽🤖

[![Java](https://img.shields.io/badge/Java-17%2B-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.12.0-FF6F00.svg)](https://www.tensorflow.org/)

基于机器学习与深度学习的足球比赛结果预测系统，为体育彩票提供数据驱动的决策支持。

## ✨ 核心特性

- **🤖 多模型集成** - 结合XGBoost、LSTM、Transformer等多种预测模型
- **📊 实时数据采集** - 自动获取最新比赛数据、球队状态、球员情报
- **🔮 概率预测** - 提供胜/平/负的概率分布与置信度评估
- **📈 历史回溯测试** - 完整的模型验证与回测框架
- **🌐 可视化分析** - 内置预测结果可视化与数据洞察面板

## 📁 项目结构

```
ai-football/
├── ai-core/                    # AI预测核心模块
│   ├── src/main/java/com/aifootball/
│   │   ├── predictor/          # 预测模型实现
│   │   ├── feature/           # 特征工程处理
│   │   ├── evaluation/        # 模型评估模块
│   │   └── utils/             # 工具类
│   └── resources/
│       └── models/            # 预训练模型存储
│
├── data-service/              # 数据服务层
│   ├── collector/             # 数据采集器
│   ├── processor/            # 数据清洗处理
│   └── storage/              # 数据存储管理
│
├── web-api/                   # RESTful API接口
├── dashboard/                 # 可视化仪表盘
├── scripts/                   # Python辅助脚本
├── docs/                      # 项目文档
└── config/                    # 配置文件
```

## 🚀 快速开始

### 环境要求

- **JDK 17+**
- **Python 3.9+** (用于部分ML脚本)
- **MySQL 8.0+** 或 **PostgreSQL 14+**
- **Redis 6.0+** (缓存服务)
- **Maven 3.6+**

### 1. 克隆项目

```bash
git clone https://github.com/Jacwo/ai-football.git
cd ai-football
```

### 2. 数据库配置

```sql
-- 创建数据库
CREATE DATABASE ai_football DEFAULT CHARSET utf8mb4;

-- 导入初始化脚本
mysql -u root -p ai_football < config/init.sql
```

### 3. 配置文件

复制并修改配置文件：

```bash
cp config/application-example.yml config/application-local.yml
```

编辑 `application-local.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ai_football
    username: your_username
    password: your_password
    
redis:
  host: localhost
  port: 6379
  
ai:
  model:
    path: ./ai-core/resources/models/
  data:
    sources:
      - api-football     # 推荐数据源
      - whoscored
      - understat
```

### 4. 构建与运行

```bash
# 安装依赖
mvn clean install

# 启动应用
mvn spring-boot:run -Dspring-boot.run.profiles=local

# 或使用Docker
docker-compose up -d
```

### 5. 初始数据采集

```bash
# 执行数据初始化脚本
python scripts/data_init.py --league EPL --season 2023-2024
```

## 📊 数据源

| 数据源 | 类型 | 频率 | 说明 |
|--------|------|------|------|
| API-Football | 实时数据 | 实时 | 主要数据源，需API密钥 |
| WhoScored | 统计数据 | 每日 | 详细比赛统计 |
| Understat | xG数据 | 每日 | 期望进球数据 |
| Transfermarkt | 球员信息 | 每周 | 球员市场价值 |

## 🧠 预测模型

### 核心算法

1. **XGBoost Ensemble**
    - 特征：历史胜负、近期状态、主场优势等
    - 用途：基准模型与特征重要性分析

2. **LSTM时序模型**
    - 特征：球队连续5-10场比赛状态序列
    - 用途：捕捉球队状态趋势变化

3. **Transformer架构**
    - 特征：多维度比赛上下文信息
    - 用途：复杂关系建模与长期依赖

4. **集成学习策略**
    - 方法：加权平均 + Stacking融合
    - 优势：提高稳定性与泛化能力

### 模型性能

| 模型 | 准确率 | 精确率 | 召回率 | AUC |
|------|--------|--------|--------|-----|
| XGBoost | 58.2% | 59.1% | 58.2% | 0.763 |
| LSTM | 61.7% | 62.3% | 61.7% | 0.812 |
| Transformer | 63.4% | 63.9% | 63.4% | 0.829 |
| Ensemble | **65.1%** | **65.6%** | **65.1%** | **0.847** |

*注：基于2020-2023五大联赛数据测试*

## 🔧 API接口

### 获取预测结果

```http
GET /api/v1/predictions/{matchId}
```

**响应示例：**

```json
{
  "success": true,
  "data": {
    "matchId": "123456",
    "homeTeam": "Manchester United",
    "awayTeam": "Manchester City",
    "predictionDate": "2024-01-15",
    "probabilities": {
      "homeWin": 0.287,
      "draw": 0.314,
      "awayWin": 0.399
    },
    "confidence": 0.782,
    "recommendation": "AWAY_WIN",
    "keyFactors": [
      "客场球队近期状态更佳",
      "历史交锋优势明显",
      "主队关键球员伤缺"
    ]
  },
  "metadata": {
    "modelVersion": "2.1.0",
    "predictionTime": "2024-01-15T14:30:00Z"
  }
}
```

### 批量预测

```http
POST /api/v1/predictions/batch
```

```json
{
  "matches": [
    {
      "homeTeamId": "33",
      "awayTeamId": "34",
      "league": "EPL",
      "matchTime": "2024-01-20T15:00:00Z"
    }
  ]
}
```

## 📈 使用示例

### Java代码调用

```java
@Autowired
private MatchPredictionService predictionService;

// 获取单场比赛预测
PredictionResult result = predictionService.predictMatch(
    "Manchester United", 
    "Manchester City",
    LocalDateTime.now().plusDays(2)
);

// 批量预测
List<MatchInput> matches = Arrays.asList(
    new MatchInput("TeamA", "TeamB", "EPL"),
    new MatchInput("TeamC", "TeamD", "LaLiga")
);

List<PredictionResult> batchResults = 
    predictionService.predictBatch(matches);
```

### Python模型训练

```python
from scripts.model_trainer import FootballPredictorTrainer

# 初始化训练器
trainer = FootballPredictorTrainer(league='EPL')

# 训练集成模型
trainer.train_ensemble(
    seasons=['2021', '2022', '2023'],
    test_size=0.2,
    n_estimators=100
)

# 评估模型性能
metrics = trainer.evaluate_model()
print(f"准确率: {metrics['accuracy']:.2%}")
```

## 🗺️ 路线图

- [ ] **v1.2.0** - 实时赔率监控与价值投注识别
- [ ] **v1.3.0** - 球员伤病影响量化模型
- [ ] **v1.4.0** - 天气因素影响分析模块
- [ ] **v1.5.0** - 多语言国际化支持
- [ ] **v2.0.0** - 深度学习模型重构与优化

## ⚠️ 免责声明

本项目为学术研究用途，旨在探索机器学习在体育预测中的应用。使用者应：

1. 遵守所在地法律法规
2. 理性对待预测结果，不保证100%准确
3. 不鼓励用于非法赌博或大额投注
4. 作者不对因使用本项目造成的任何损失负责

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- **项目维护者**: Jacwo
- **GitHub**: [@Jacwo](https://github.com/Jacwo)
- **问题反馈**: [GitHub Issues](https://github.com/Jacwo/ai-football/issues)

## 🙏 致谢

感谢以下开源项目提供的支持：

- [API-Football](https://www.api-football.com/) - 足球数据API
- [XGBoost](https://xgboost.ai/) - 梯度提升框架
- [TensorFlow](https://www.tensorflow.org/) - 深度学习平台
- [Spring Boot](https://spring.io/projects/spring-boot) - Java应用框架

---

**⭐ 如果这个项目对你有帮助，请给我们一个Star！** ⭐

*最后更新: 2024年1月*