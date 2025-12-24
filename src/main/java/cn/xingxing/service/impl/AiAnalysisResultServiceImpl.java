package cn.xingxing.service.impl;


import cn.xingxing.domain.AiAnalysisResult;
import cn.xingxing.mapper.AiAnalysisResultMapper;
import cn.xingxing.service.AiAnalysisResultService;
import cn.xingxing.vo.AiAnalysisResultVo;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

/**
 * @Author: yangyuanliang
 * @Date: 2025-12-24
 * @Version: 1.0
 */
@Service
public class AiAnalysisResultServiceImpl  extends ServiceImpl<AiAnalysisResultMapper, AiAnalysisResult> implements AiAnalysisResultService {
    @Override
    public AiAnalysisResultVo findByMatchId(String matchId) {
        AiAnalysisResultVo  aiAnalysisResultVo = new AiAnalysisResultVo();
        LambdaQueryWrapper<AiAnalysisResult> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AiAnalysisResult::getMatchId,matchId);
        AiAnalysisResult aiAnalysisResult = baseMapper.selectOne(queryWrapper);
        BeanUtils.copyProperties(aiAnalysisResult,aiAnalysisResultVo);
        return aiAnalysisResultVo;
    }
}
