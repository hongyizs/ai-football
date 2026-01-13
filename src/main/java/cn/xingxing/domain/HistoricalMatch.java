package cn.xingxing.domain;


import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

/**
 * @Author: yangyuanliang
 * @Date: 2025-12-20
 * @Version: 1.0
 */
@Setter
@Getter
@TableName("historical_match")
public class HistoricalMatch extends BaseEntity {
    @TableId
    private Integer  id;
    private String matchId;
    private String homeTeam;
    private String awayTeam;
    private String score;
    private String league;
    private String matchDate;

    public HistoricalMatch() {}

    public HistoricalMatch(Integer id, String matchId, String homeTeam, String awayTeam, String score, String league, String matchDate) {
        this.id = id;
        this.matchId = matchId;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.score = score;
        this.league = league;
        this.matchDate = matchDate;
    }

    public static HistoricalMatchBuilder builder() {
        return new HistoricalMatchBuilder();
    }

    public static class HistoricalMatchBuilder {
        private Integer id;
        private String matchId;
        private String homeTeam;
        private String awayTeam;
        private String score;
        private String league;
        private String matchDate;

        HistoricalMatchBuilder() {}

        public HistoricalMatchBuilder id(Integer id) {
            this.id = id;
            return this;
        }

        public HistoricalMatchBuilder matchId(String matchId) {
            this.matchId = matchId;
            return this;
        }

        public HistoricalMatchBuilder homeTeam(String homeTeam) {
            this.homeTeam = homeTeam;
            return this;
        }

        public HistoricalMatchBuilder awayTeam(String awayTeam) {
            this.awayTeam = awayTeam;
            return this;
        }

        public HistoricalMatchBuilder score(String score) {
            this.score = score;
            return this;
        }

        public HistoricalMatchBuilder league(String league) {
            this.league = league;
            return this;
        }

        public HistoricalMatchBuilder matchDate(String matchDate) {
            this.matchDate = matchDate;
            return this;
        }

        public HistoricalMatch build() {
            return new HistoricalMatch(id, matchId, homeTeam, awayTeam, score, league, matchDate);
        }
    }
}