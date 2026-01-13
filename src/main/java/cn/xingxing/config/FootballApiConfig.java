package cn.xingxing.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "football.api")
public class FootballApiConfig {

    // 彩票API
    private String matchListUrl = "https://webapi.sporttery.cn/gateway/uniform/fb/getMatchDataPageListV1.qry?method=concern";
    private String fixedBonusUrl = "https://webapi.sporttery.cn/gateway/uniform/football/getFixedBonusV1.qry?clientCode=3001&matchId=";
    private String searchOddsUrl = "https://webapi.sporttery.cn/gateway/uniform/football/searchOddsV1.qry?channel=c&type=&single=0&h=%s&a=%s&d=%s";
    private String searchOddsUrl2 = "https://webapi.sporttery.cn/gateway/uniform/football/searchOddsV1.qry?channel=c&type=&single=1&h=%s&a=%s&d=%s";

    private String resultHistoryUrl = "https://webapi.sporttery.cn/gateway/uniform/football/getResultHistoryV1.qry?" +
            "sportteryMatchId=%s&termLimits=10&tournamentFlag=0&homeAwayFlag=0";
    //比赛近况
    private String matchHistoryUrl =
            "https://webapi.sporttery.cn/gateway/uniform/football/getMatchResultV1.qry?sportteryMatchId=%s&termLimits=5&tournamentFlag=0&homeAwayFlag=0";
    //比赛结果
    private String matchResultUrl = "https://webapi.sporttery.cn/gateway/uniform/fb/getMatchDataPageListV1.qry?" +
            "method=result&pageNo=1&pageType=0&pageSize=300";
    //比赛特征
    private String matchFeatureUrl= "https://webapi.sporttery.cn/gateway/uniform/football/getMatchFeatureV1.qry?termLimits=10&sportteryMatchId=%s";
    //射手榜
    private String player = "https://webapi.sporttery.cn/gateway/uniform/football/getMatchPlayerV1.qry?sportteryMatchId=2036289&termLimits=3";
    //伤停信息
    private String injurySuspension = "https://webapi.sporttery.cn/gateway/uniform/football/getInjurySuspensionV1.qry?sportteryMatchId=2036289";
    // 飞书Webhook
    private String feishuWebhookUrl = "https://open.feishu.cn/open-apis/bot/v2/hook/a553e701-25e0-4e58-ad26-920fde4c2631";

    // 定时任务配置
    private long scheduleInitialDelay = 10000;
    private long scheduleFixedDelay = 14400000;

    // 超时配置
    private int httpConnectTimeout = 20000;
    private int httpReadTimeout = 50000;

    public String getMatchListUrl() {
        return matchListUrl;
    }

    public void setMatchListUrl(String matchListUrl) {
        this.matchListUrl = matchListUrl;
    }

    public String getFixedBonusUrl() {
        return fixedBonusUrl;
    }

    public void setFixedBonusUrl(String fixedBonusUrl) {
        this.fixedBonusUrl = fixedBonusUrl;
    }

    public String getSearchOddsUrl() {
        return searchOddsUrl;
    }

    public void setSearchOddsUrl(String searchOddsUrl) {
        this.searchOddsUrl = searchOddsUrl;
    }

    public String getSearchOddsUrl2() {
        return searchOddsUrl2;
    }

    public void setSearchOddsUrl2(String searchOddsUrl2) {
        this.searchOddsUrl2 = searchOddsUrl2;
    }

    public String getResultHistoryUrl() {
        return resultHistoryUrl;
    }

    public void setResultHistoryUrl(String resultHistoryUrl) {
        this.resultHistoryUrl = resultHistoryUrl;
    }

    public String getMatchHistoryUrl() {
        return matchHistoryUrl;
    }

    public void setMatchHistoryUrl(String matchHistoryUrl) {
        this.matchHistoryUrl = matchHistoryUrl;
    }

    public String getMatchResultUrl() {
        return matchResultUrl;
    }

    public void setMatchResultUrl(String matchResultUrl) {
        this.matchResultUrl = matchResultUrl;
    }

    public String getMatchFeatureUrl() {
        return matchFeatureUrl;
    }

    public void setMatchFeatureUrl(String matchFeatureUrl) {
        this.matchFeatureUrl = matchFeatureUrl;
    }

    public String getPlayer() {
        return player;
    }

    public void setPlayer(String player) {
        this.player = player;
    }

    public String getInjurySuspension() {
        return injurySuspension;
    }

    public void setInjurySuspension(String injurySuspension) {
        this.injurySuspension = injurySuspension;
    }

    public String getFeishuWebhookUrl() {
        return feishuWebhookUrl;
    }

    public void setFeishuWebhookUrl(String feishuWebhookUrl) {
        this.feishuWebhookUrl = feishuWebhookUrl;
    }

    public long getScheduleInitialDelay() {
        return scheduleInitialDelay;
    }

    public void setScheduleInitialDelay(long scheduleInitialDelay) {
        this.scheduleInitialDelay = scheduleInitialDelay;
    }

    public long getScheduleFixedDelay() {
        return scheduleFixedDelay;
    }

    public void setScheduleFixedDelay(long scheduleFixedDelay) {
        this.scheduleFixedDelay = scheduleFixedDelay;
    }

    public int getHttpConnectTimeout() {
        return httpConnectTimeout;
    }

    public void setHttpConnectTimeout(int httpConnectTimeout) {
        this.httpConnectTimeout = httpConnectTimeout;
    }

    public int getHttpReadTimeout() {
        return httpReadTimeout;
    }

    public void setHttpReadTimeout(int httpReadTimeout) {
        this.httpReadTimeout = httpReadTimeout;
    }
}
