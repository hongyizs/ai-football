package cn.xingxing.service.impl;


import cn.xingxing.domain.TeamStats;
import cn.xingxing.mapper.TeamStatsMapper;
import cn.xingxing.service.TeamStatsService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * @Author: yangyuanliang
 * @Date: 2025-12-25
 * @Version: 1.0
 */
@Service
public class TeamStatsServiceImpl implements TeamStatsService {
    @Autowired
    TeamStatsMapper teamStatsMapper;


    @Override
    public void loadTeamStats(String name) {
        try {
            String fileName = "/data/" + name + ".json";
            ClassPathResource resource = new ClassPathResource(fileName);
            InputStream inputStream = resource.getInputStream();


            String jsonContent = new String(inputStream.readAllBytes());
            List<TeamStats> teamStatsList = JSONObject.parseArray(jsonContent, TeamStats.class);

            System.out.println("成功读取 " + teamStatsList.size() + " 支球队数据");
            List<TeamStats> newTeamStatsList = new ArrayList<>();
            teamStatsList.forEach(teamStats -> {
                TeamStats teamStatsDB = selectByTeam(teamStats.getTeam());
                if (teamStatsDB != null) {
                    teamStats.setTeamName(teamStatsDB.getTeamName());
                    teamStats.setId(teamStatsDB.getId());
                    BeanUtils.copyProperties(teamStats, teamStatsDB);
                    newTeamStatsList.add(teamStatsDB);
                } else {
                    newTeamStatsList.add(teamStats);
                }
            });
            teamStatsMapper.insertOrUpdate(newTeamStatsList);
        } catch (Exception e) {
            System.err.println("导入数据时发生错误: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("数据导入失败", e);
        }

    }

    @Override
    public TeamStats selectByTeamName(String teamName) {
        LambdaQueryWrapper<TeamStats> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(TeamStats::getTeamName, teamName);

        return teamStatsMapper.selectOne(queryWrapper);
    }

    @Override
    public TeamStats selectByTeam(String team) {
        LambdaQueryWrapper<TeamStats> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(TeamStats::getTeam, team);
        return teamStatsMapper.selectOne(queryWrapper);
    }
}
