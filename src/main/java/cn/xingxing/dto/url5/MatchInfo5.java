package cn.xingxing.dto.url5;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class MatchInfo5 {
    private List<Match> matchList;
    private Statistics statistics;

    public List<Match> getMatchList() {
        return matchList;
    }

    public void setMatchList(List<Match> matchList) {
        this.matchList = matchList;
    }

    public Statistics getStatistics() {
        return statistics;
    }

    public void setStatistics(Statistics statistics) {
        this.statistics = statistics;
    }
}
