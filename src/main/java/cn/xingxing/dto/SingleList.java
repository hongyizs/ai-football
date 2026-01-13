package cn.xingxing.dto;

import lombok.Data;

public class SingleList {
     private Integer single;
     private String poolCode;

     public Integer getSingle() {
          return single;
     }

     public void setSingle(Integer single) {
          this.single = single;
     }

     public String getPoolCode() {
          return poolCode;
     }

     public void setPoolCode(String poolCode) {
          this.poolCode = poolCode;
     }
}
