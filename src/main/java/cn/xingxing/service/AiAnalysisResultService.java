package cn.xingxing.service;


import cn.xingxing.domain.AiAnalysisResult;
import cn.xingxing.domain.SubMatchInfo;
import cn.xingxing.vo.AiAnalysisResultVo;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Author: yangyuanliang
 * @Date: 2025-12-24
 * @Version: 1.0
 */
public interface AiAnalysisResultService extends IService<AiAnalysisResult> {
    AiAnalysisResultVo findByMatchId(String matchId);

}
