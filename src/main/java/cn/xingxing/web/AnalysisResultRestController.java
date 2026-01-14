package cn.xingxing.web;

import cn.xingxing.domain.AiAnalysisResult;
import cn.xingxing.dto.ApiResponse;
import cn.xingxing.dto.PageVO;
import cn.xingxing.service.AiAnalysisResultService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * AI分析结果REST API控制器
 * 提供历史数据查询接口
 */
@Slf4j
@RestController
@RequestMapping("/api/analysis")
public class AnalysisResultRestController {

    @Autowired
    private AiAnalysisResultService analysisResultService;

    /**
     * 分页查询分析结果列表
     * @param page 页码，默认1
     * @param size 每页大小，默认20
     * @return 分页结果
     */
    @GetMapping("/list")
    public ApiResponse<PageVO<AiAnalysisResult>> getAnalysisList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("查询分析结果列表: page={}, size={}", page, size);
        
        try {
            // 使用MyBatis Plus进行分页查询，按创建时间降序排序
            Page<AiAnalysisResult> resultPage = analysisResultService.page(
                new Page<>(page, size),
                new QueryWrapper<AiAnalysisResult>()
                    .orderByDesc("create_time")
            );
            
            // 转换为PageVO
            PageVO<AiAnalysisResult> pageVO = new PageVO<>(
                resultPage.getCurrent(),
                resultPage.getSize(),
                resultPage.getTotal(),
                resultPage.getRecords()
            );
            
            log.info("查询成功: total={}, records={}", pageVO.getTotal(), pageVO.getList().size());
            return ApiResponse.success(pageVO);
            
        } catch (Exception e) {
            log.error("查询分析结果列表失败: page={}, size={}, error={}", page, size, e.getMessage(), e);
            return ApiResponse.error("查询失败: " + e.getMessage());
        }
    }

    /**
     * 根据ID查询单个分析结果
     * @param id 分析结果ID
     * @return 分析结果
     */
    @GetMapping("/{id}")
    public ApiResponse<AiAnalysisResult> getAnalysisById(@PathVariable String id) {
        log.info("查询分析结果: id={}", id);
        
        try {
            AiAnalysisResult result = analysisResultService.getById(id);
            
            if (result != null) {
                log.info("查询成功: id={}, matchId={}", id, result.getMatchId());
                return ApiResponse.success(result);
            } else {
                log.warn("数据不存在: id={}", id);
                return ApiResponse.error("数据不存在");
            }
            
        } catch (Exception e) {
            log.error("查询分析结果失败: id={}, error={}", id, e.getMessage(), e);
            return ApiResponse.error("查询失败: " + e.getMessage());
        }
    }
}
