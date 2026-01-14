package cn.xingxing.service;

import cn.xingxing.domain.*;
import cn.xingxing.notify.NotifyService;
import cn.xingxing.vo.AiAnalysisResultVo;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import cn.xingxing.config.FootballApiConfig;
import cn.xingxing.dto.*;
import cn.xingxing.dto.url5.Match;
import cn.xingxing.dto.url5.MatchInfo5;
import cn.xingxing.util.HttpClientUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FootballAnalysisService {

    @Autowired
    private FootballApiConfig apiConfig;

    @Autowired
    private AIService aiService;

    @Autowired
    private ExecutorService footballExecutor;

    @Autowired
    private MatchInfoService matchInfoService;

    @Autowired
    private HistoricalMatchService historicalMatchService;
    @Autowired
    private SimilarMatchService similarMatchService;

    @Autowired
    private HadListService hadListService;

    @Autowired
    private AiAnalysisResultService aiAnalysisResultService;

    @Autowired
    private TeamStatsService teamStatsService;

    @Autowired
    private InformationService informationService;

    @Autowired
    private NotifyService notifyService;

    @Autowired(required = false)
    private cn.xingxing.websocket.AnalysisWebSocketHandler webSocketHandler;

    private static final DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public List<MatchAnalysis> analyzeMatches(List<SubMatchInfo> validMatches) {
        log.info("开始分析比赛数据...");
        try {
            List<CompletableFuture<MatchAnalysis>> futures = validMatches.stream()
                    .map(match -> CompletableFuture.supplyAsync(() ->
                            analyzeSingleMatch(match), footballExecutor))
                    .toList();

            // 4. 等待所有分析完成
            CompletableFuture<Void> allFutures = CompletableFuture.allOf(
                    futures.toArray(new CompletableFuture[0])
            );

            allFutures.join();

            // 5. 收集结果
            List<MatchAnalysis> results = futures.stream()
                    .map(CompletableFuture::join)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            log.info("比赛分析完成，共分析 {} 场比赛", results.size());
            return results;

        } catch (Exception e) {
            log.error("比赛分析失败", e);
            return Collections.emptyList();
        }
    }


    private MatchAnalysis analyzeSingleMatch(SubMatchInfo match) {
        try {
            String matchId = String.valueOf(match.getMatchId());
            AiAnalysisResultVo byMatchId = aiAnalysisResultService.findByMatchId(matchId);
            // 构建分析对象
            MatchAnalysis analysis = MatchAnalysis.builder()
                    .homeTeam(match.getHomeTeamAbbName())
                    .awayTeam(match.getAwayTeamAbbName())
                    .matchTime(parseMatchTime(match.getMatchDate(), match.getMatchTime()))
                    .league(match.getLeagueAbbName())
                    .matchId(matchId)
                    .build();
            if (byMatchId != null) {
                analysis.setAiAnalysis(byMatchId.getAiAnalysis());
                LocalDateTime createTime = byMatchId.getCreateTime();
                analysis.setTimestamp(createTime.atZone(ZoneId.systemDefault())
                        .toInstant()
                        .toEpochMilli());
                return analysis;
            }
            // 获取近期交锋记录
            analysis.setRecentMatches(historicalMatchService.findHistoricalMatch(matchId));

            // 获取赔率历史
            analysis.setSimilarMatches(getSimilarMatches(matchId));
            //特征数据
            analysis.setMatchAnalysisData(getMatchAnalysisData(matchId));
            //近期比赛
            analysis.setMatchHistoryData(getMatchHistoryData(matchId));
            analysis.setHadLists(hadListService.findHadList(matchId));
            analysis.setHhadLists(hadListService.findHHadList(matchId));
            analysis.setHomeTeamStats(teamStatsService.selectByTeamName(match.getHomeTeamAbbName(), "home"));
            analysis.setAwayTeamStats(teamStatsService.selectByTeamName(match.getAwayTeamAbbName(), "away"));
            Information byId = informationService.getById(matchId);
            if (byId != null) {
                analysis.setInformation(byId.getInfo());
            }
            analysis.setAiAnalysis(aiService.analyzeMatch(analysis));
            analysis.setTimestamp(System.currentTimeMillis());
            return analysis;

        } catch (Exception e) {
            log.error("分析单场比赛失败: {} vs {}",
                    match.getHomeTeamAbbName(), match.getAwayTeamAbbName(), e);
            return null;
        }
    }

    private MatchHistoryData getMatchHistoryData(String matchId) {
        String url = String.format(apiConfig.getMatchHistoryUrl(), matchId);
        String response = HttpClientUtil.doGet(url, apiConfig.getHttpConnectTimeout());
        MatchHistoryResponse matchAnalysisResponse = JSONObject.parseObject(response, MatchHistoryResponse.class);
        return matchAnalysisResponse.getValue();

    }

    private MatchAnalysisData getMatchAnalysisData(String matchId) {
        try {
            String url = String.format(apiConfig.getMatchFeatureUrl(), matchId);
            String response = HttpClientUtil.doGet(url, apiConfig.getHttpConnectTimeout());
            MatchAnalysisResponse matchAnalysisResponse = JSONObject.parseObject(response, MatchAnalysisResponse.class);
            return matchAnalysisResponse.getValue();
        } catch (Exception e) {
            log.error("获取比赛特征失败", e);
        }

        return null;
    }

    private LocalDateTime parseMatchTime(String date, String time) {
        try {
            String dateTimeStr = date + " " + time;
            return LocalDateTime.parse(dateTimeStr, DATE_TIME_FORMATTER);
        } catch (Exception e) {
            log.warn("解析比赛时间失败: {} {}", date, time, e);
            return LocalDateTime.now();
        }
    }

    private List<HistoricalMatch> getRecentMatches(String matchId) {
        try {
            String url = String.format(apiConfig.getResultHistoryUrl(), matchId);
            String response = HttpClientUtil.doGet(url, apiConfig.getHttpConnectTimeout());

            JSONObject json = JSONObject.parseObject(response);
            Object value = json.get("value");

            if (value != null) {
                MatchInfo5 matchInfo5 = JSONObject.parseObject(
                        JSONObject.toJSONString(value),
                        MatchInfo5.class
                );

                if (matchInfo5 != null && !CollectionUtils.isEmpty(matchInfo5.getMatchList())) {
                    return matchInfo5.getMatchList().stream()
                            .map(this::convertToHistoricalMatch)
                            .collect(Collectors.toList());
                }
            }
        } catch (Exception e) {
            log.error("获取近期比赛失败: {}", matchId, e);
        }

        return Collections.emptyList();
    }

    private HistoricalMatch convertToHistoricalMatch(Match match) {
        return HistoricalMatch.builder()
                .homeTeam(match.getHomeTeamShortName())
                .awayTeam(match.getAwayTeamShortName())
                .score(match.getFullCourtGoal())
                .matchDate(match.getMatchDate())
                .build();
    }

    private List<SimilarMatch> getSimilarMatches(String matchId) {
        try {
            return similarMatchService.findSimilarMatch(matchId);
        } catch (Exception e) {
            log.error("获取赔率历史失败: {}", matchId, e);
        }

        return Collections.emptyList();
    }

    private List<HistoricalMatch> getSimilarMatches(double homeWin, double awayWin, double draw) {
        try {
            String url = String.format(apiConfig.getSearchOddsUrl(), homeWin, awayWin, draw);
            String response = HttpClientUtil.doGet(url, apiConfig.getHttpConnectTimeout());

            MatchInfoResponse3 matchInfoResponse3 = JSONObject.parseObject(response, MatchInfoResponse3.class);
            List<MatchItem> matchList = matchInfoResponse3.getValue().getMatchList();

            if (!CollectionUtils.isEmpty(matchList)) {
                return matchList.stream()
                        .map(this::convertMatchItem)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.error("获取相似比赛失败", e);
        }

        return Collections.emptyList();
    }

    private HistoricalMatch convertMatchItem(MatchItem item) {
        return HistoricalMatch.builder()
                .homeTeam(item.getHomeTeamAbbName())
                .awayTeam(item.getAwayTeamAbbName())
                .score(item.getSectionsNo999())
                .league(item.getLeaguesAbbName())
                .build();
    }

    public void analyzeAndNotify() {
        List<SubMatchInfo> currentDateMatch = matchInfoService.findMatchList();
        List<List<SubMatchInfo>> lists = splitIntoBatches(currentDateMatch, 3);
        lists.forEach(list -> {
            List<MatchAnalysis> analyses = analyzeMatches(list);
            // 保存分析结果并推送
            saveAndBroadcastAnalyses(analyses);
            //  notifyService.sendMsg(analyses);
        });

    }

    /**
     * 保存分析结果到数据库并通过WebSocket广播
     */
    private void saveAndBroadcastAnalyses(List<MatchAnalysis> analyses) {
        if (CollectionUtils.isEmpty(analyses)) {
            log.warn("没有分析结果需要保存和推送");
            return;
        }

        analyses.forEach(analysis -> {
            try {
                // 转换为实体对象
                AiAnalysisResult result = convertToEntity(analysis);
                
                // 检查是否已存在该matchId的记录
                AiAnalysisResult existing = aiAnalysisResultService.lambdaQuery()
                        .eq(AiAnalysisResult::getMatchId, result.getMatchId())
                        .one();
                
                if (existing != null) {
                    // 已存在，更新记录
                    result.setId(existing.getId());
                    aiAnalysisResultService.updateById(result);
                    log.info("分析结果已更新: matchId={}, homeTeam={}, awayTeam={}", 
                            result.getMatchId(), result.getHomeTeam(), result.getAwayTeam());
                } else {
                    // 不存在，插入新记录
                    aiAnalysisResultService.save(result);
                    log.info("分析结果已保存: matchId={}, homeTeam={}, awayTeam={}", 
                            result.getMatchId(), result.getHomeTeam(), result.getAwayTeam());
                }
                
                // 通过WebSocket推送到前端
                if (webSocketHandler != null) {
                    webSocketHandler.broadcast(result);
                    log.info("分析结果已推送: matchId={}", result.getMatchId());
                } else {
                    log.warn("WebSocket处理器未初始化，跳过推送");
                }
                
            } catch (Exception e) {
                log.error("保存或推送分析结果失败: matchId={}, error={}", 
                        analysis.getMatchId(), e.getMessage(), e);
            }
        });
    }

    /**
     * 将MatchAnalysis转换为AiAnalysisResult实体
     */
    private AiAnalysisResult convertToEntity(MatchAnalysis analysis) {
        AiAnalysisResult result = new AiAnalysisResult();
        result.setMatchId(analysis.getMatchId());
        result.setHomeTeam(analysis.getHomeTeam());
        result.setAwayTeam(analysis.getAwayTeam());
        result.setMatchTime(analysis.getMatchTime());
        result.setAiAnalysis(analysis.getAiAnalysis());
        
        // 从AI分析结果中提取胜平负概率和预测
        extractPredictions(analysis.getAiAnalysis(), result);
        
        result.setCreateTime(LocalDateTime.now());
        return result;
    }

    /**
     * 从AI分析文本中提取预测信息
     */
    private void extractPredictions(String aiAnalysis, AiAnalysisResult result) {
        if (aiAnalysis == null || aiAnalysis.isEmpty()) {
            return;
        }
        
        try {
            // 尝试从JSON格式的分析结果中提取
            if (aiAnalysis.contains("{") && aiAnalysis.contains("}")) {
                JSONObject json = JSONObject.parseObject(aiAnalysis);
                result.setHomeWin(json.getString("homeWin"));
                result.setDraw(json.getString("draw"));
                result.setAwayWin(json.getString("awayWin"));
                result.setAiScore(json.getString("predictedScore"));
                result.setAiResult(json.getString("predictedResult"));
            }
        } catch (Exception e) {
            log.debug("无法从JSON提取预测信息，使用默认值: {}", e.getMessage());
            // 如果解析失败，设置默认值
            result.setHomeWin("待分析");
            result.setDraw("待分析");
            result.setAwayWin("待分析");
            result.setAiScore("待分析");
            result.setAiResult("待分析");
        }
    }

    private List<List<SubMatchInfo>> splitIntoBatches(List<SubMatchInfo> analyses, int batchSize) {
        List<List<SubMatchInfo>> batches = new ArrayList<>();
        for (int i = 0; i < analyses.size(); i += batchSize) {
            int end = Math.min(analyses.size(), i + batchSize);
            batches.add(new ArrayList<>(analyses.subList(i, end)));
        }

        return batches;
    }


    public MatchAnalysis analysisByMatchId(String matchId) {
        SubMatchInfo byId = matchInfoService.getById(matchId);
        return analyzeSingleMatch(byId);
    }

    public Flux<String> analysisByMatchIdStream(String matchId) {
        SubMatchInfo byId = matchInfoService.getById(matchId);
        return analyzeSingleMatchStream(byId);
    }

    private Flux<String> analyzeSingleMatchStream(SubMatchInfo match) {
        String matchId = String.valueOf(match.getMatchId());
        AiAnalysisResultVo byMatchId = aiAnalysisResultService.findByMatchId(matchId);
        // 构建分析对象
        MatchAnalysis analysis = MatchAnalysis.builder()
                .homeTeam(match.getHomeTeamAbbName())
                .awayTeam(match.getAwayTeamAbbName())
                .matchTime(parseMatchTime(match.getMatchDate(), match.getMatchTime()))
                .league(match.getLeagueAbbName())
                .matchId(matchId)
                .build();

        // 获取近期交锋记录
        analysis.setRecentMatches(historicalMatchService.findHistoricalMatch(matchId));

        // 获取赔率历史
        analysis.setSimilarMatches(getSimilarMatches(matchId));
        //特征数据
        analysis.setMatchAnalysisData(getMatchAnalysisData(matchId));
        //近期比赛
        analysis.setMatchHistoryData(getMatchHistoryData(matchId));
        analysis.setHadLists(hadListService.findHadList(matchId));
        analysis.setHhadLists(hadListService.findHHadList(matchId));
        analysis.setHomeTeamStats(teamStatsService.selectByTeamName(match.getHomeTeamAbbName(), "home"));
        analysis.setAwayTeamStats(teamStatsService.selectByTeamName(match.getAwayTeamAbbName(), "away"));
        Information byId = informationService.getById(matchId);
        if (byId != null) {
            analysis.setInformation(byId.getInfo());
        }
        return aiService.analyzeMatchStream(analysis);
    }
}