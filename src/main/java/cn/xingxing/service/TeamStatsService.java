package cn.xingxing.service;

import cn.xingxing.domain.TeamStats;

/**
 * @Author: yangyuanliang
 * @Date: 2025-12-25
 * @Version: 1.0
 */
public interface TeamStatsService {
    void loadTeamStats(String name);

    TeamStats selectByTeamName(String teamName);

    TeamStats selectByTeam(String team);

}
