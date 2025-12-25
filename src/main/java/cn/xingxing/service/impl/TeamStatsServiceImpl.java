package cn.xingxing.service.impl;


import cn.xingxing.domain.TeamStats;
import cn.xingxing.mapper.TeamStatsMapper;
import cn.xingxing.service.TeamStatsService;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
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

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void loadTeamStats(Integer matchId) {
        try {
            // 1. 从 classpath 读取文件
            ClassPathResource resource = new ClassPathResource("/data/法甲.json");
            InputStream inputStream = resource.getInputStream();

            // 2. 解析 JSON 数据
            /*List<TeamStats> teamStatsList = objectMapper.readValue(
                    inputStream,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, TeamStats.class)
            );*/
            String jsonContent = new String(inputStream.readAllBytes());
            List<TeamStats> teamStatsList = JSONObject.parseArray(jsonContent, TeamStats.class);

            System.out.println("成功读取 " + teamStatsList.size() + " 支球队数据");



            // 4. 批量插入数据
            teamStatsMapper.insertBatch(teamStatsList);
            // 或者使用循环单条插入
            // for (TeamStats team : teamStatsList) {
            //     teamStatsMapper.insert(team);
            // }


        } catch (Exception e) {
            System.err.println("导入数据时发生错误: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("数据导入失败", e);
        }

    }
}
