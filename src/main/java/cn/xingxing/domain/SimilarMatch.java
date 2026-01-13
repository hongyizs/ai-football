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
@TableName("similar_match")
public class SimilarMatch extends BaseEntity {
    @TableId
    private String  id;
    private String matchId;
    private String homeTeam;
    private String awayTeam;
    private String score;
    private String league;
    private String matchDate;
    //ke
    private String a;
    //ping
    private String d;
    //zhu
    private String h;

    public SimilarMatch() {}

    public SimilarMatch(String id, String matchId, String homeTeam, String awayTeam, String score, String league, String matchDate, String a, String d, String h) {
        this.id = id;
        this.matchId = matchId;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.score = score;
        this.league = league;
        this.matchDate = matchDate;
        this.a = a;
        this.d = d;
        this.h = h;
    }

    public static SimilarMatchBuilder builder() {
        return new SimilarMatchBuilder();
    }

    public static class SimilarMatchBuilder {
        private String id;
        private String matchId;
        private String homeTeam;
        private String awayTeam;
        private String score;
        private String league;
        private String matchDate;
        private String a;
        private String d;
        private String h;

        SimilarMatchBuilder() {}

        public SimilarMatchBuilder id(String id) {
            this.id = id;
            return this;
        }

        public SimilarMatchBuilder matchId(String matchId) {
            this.matchId = matchId;
            return this;
        }

        public SimilarMatchBuilder homeTeam(String homeTeam) {
            this.homeTeam = homeTeam;
            return this;
        }

        public SimilarMatchBuilder awayTeam(String awayTeam) {
            this.awayTeam = awayTeam;
            return this;
        }

        public SimilarMatchBuilder score(String score) {
            this.score = score;
            return this;
        }

        public SimilarMatchBuilder league(String league) {
            this.league = league;
            return this;
        }

        public SimilarMatchBuilder matchDate(String matchDate) {
            this.matchDate = matchDate;
            return this;
        }

        public SimilarMatchBuilder a(String a) {
            this.a = a;
            return this;
        }

        public SimilarMatchBuilder d(String d) {
            this.d = d;
            return this;
        }

        public SimilarMatchBuilder h(String h) {
            this.h = h;
            return this;
        }

        public SimilarMatch build() {
            return new SimilarMatch(id, matchId, homeTeam, awayTeam, score, league, matchDate, a, d, h);
        }
    }
}