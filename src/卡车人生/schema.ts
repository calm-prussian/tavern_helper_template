export const Schema = z.object({
  世界: z
    .object({
      时间: z
        .object({
          日期: z.string().prefault('三月初'),
          时刻: z.string().prefault('09:05'),
        })
        .prefault({}),

      天气: z
        .object({
          代码: z.enum(['clear', 'cloudy', 'overcast', 'rain', 'storm', 'snow', 'fog', 'wind']).prefault('overcast'),
          气温: z.coerce.number().transform(v => Math.round(v)).prefault(2),
        })
        .prefault({}),

      位置: z
        .object({
          国家: z.string().prefault('德国'),
          城市: z.string().prefault('柏林'),
          道路: z.string().prefault('停靠'),
          地点类型: z
            .enum(['公司', '停车场', '货运站', '服务区', '加油站', '边境', '高速', '城区', '维修站', '商店', '港口', '仓库', '其他'])
            .prefault('停车场'),
        })
        .prefault({}),
    })
    .prefault({}),

  运输: z
    .object({
      状态: z.enum(['待选择', '待出发', '运输中', '交货中', '已完成']).prefault('待选择'),
      当前货单: z
        .object({
          起点: z.string().prefault('柏林'),
          终点: z.string().prefault('待选择'),
          货物名称: z.string().prefault('待选择'),
          挂车类型: z.string().prefault('待选择'),
          报酬: z.coerce.number().transform(v => Math.max(0, Math.round(v))).prefault(0),
          总距离km: z.coerce.number().transform(v => Math.max(0, Math.round(v))).prefault(0),
          剩余km: z.coerce.number().transform(v => Math.max(0, Math.round(v))).prefault(0),
          有时限: z.boolean().prefault(false),
          时限分钟: z.coerce.number().transform(v => Math.max(0, Math.round(v))).prefault(0),
          剩余时间分钟: z.coerce.number().transform(v => Math.max(0, Math.round(v))).prefault(0),
          任务标签: z
            .record(z.string().describe('任务标签'), z.boolean())
            .transform(data => _.pickBy(data, value => value === true))
            .prefault({}),
          特种任务监控: z
            .record(z.string().describe('监控项名'), z.union([z.coerce.number(), z.string()]))
            .prefault({}),
        })
        .prefault({}),
    })
    .prefault({}),

  车辆: z
    .object({
      车型: z
        .object({
          品牌: z.string().prefault('雷诺'),
          型号: z.string().prefault('T 480'),
          驾驶室规格: z.string().prefault('高顶'),
          底盘规格: z.string().prefault('4x2'),
        })
        .prefault({}),

      组件: z
        .object({
          发动机: z
            .object({
              型号: z.string().prefault('原厂480马力柴油机'),
              性能: z.string().prefault('长途均衡'),
            })
            .prefault({}),

          变速箱: z
            .object({
              型号: z.string().prefault('原厂12挡AMT'),
              性能: z.string().prefault('平顺省力'),
            })
            .prefault({}),

          悬挂: z
            .object({
              型号: z.string().prefault('原厂长途悬挂'),
              性能: z.string().prefault('舒适稳定'),
            })
            .prefault({}),

          刹车: z
            .object({
              型号: z.string().prefault('原厂气刹系统'),
              性能: z.string().prefault('制动线性'),
            })
            .prefault({}),

          轮胎: z
            .object({
              型号: z.string().prefault('标准长途轮胎'),
              性能: z.string().prefault('耐磨稳定'),
            })
            .prefault({}),

          油箱: z
            .object({
              型号: z.string().prefault('原厂铝合金油箱'),
              容量L: z.coerce.number().transform(v => Math.max(1, Math.round(v))).prefault(540),
            })
            .prefault({}),
        })
        .prefault({}),

      燃油: z
        .object({
          当前L: z.coerce.number().transform(v => Math.max(0, Math.round(v))).prefault(491),
        })
        .prefault({}),

      行驶: z
        .object({
          车速: z.coerce.number().transform(v => Math.max(0, Math.round(v))).prefault(0),
          限速: z.coerce.number().transform(v => Math.max(0, Math.round(v))).prefault(0),
        })
        .prefault({}),

      疲劳: z.enum(['低', '中', '高', '危险']).prefault('低'),

      车况: z
        .object({
          发动机: z.enum(['优秀', '良好', '注意', '需维修']).prefault('良好'),
          变速箱: z.enum(['优秀', '良好', '注意', '需维修']).prefault('良好'),
          轮胎: z.enum(['优秀', '良好', '注意', '需维修']).prefault('良好'),
          刹车: z.enum(['优秀', '良好', '注意', '需维修']).prefault('良好'),
          底盘: z.enum(['优秀', '良好', '注意', '需维修']).prefault('良好'),
        })
        .prefault({}),

      电台: z
        .object({
          状态: z.enum(['未开启', '开启', '已关闭']).prefault('未开启'),
          名称: z.string().prefault(''),
          国家: z.string().prefault(''),
          地区: z.string().prefault(''),
          节目类型: z.string().prefault(''),
        })
        .prefault({}),
    })
    .prefault({}),

  经济: z
    .object({
      余额: z.coerce.number().transform(v => Math.round(v)).prefault(8340),
    })
    .prefault({}),

  驾驶室: z
    .object({
      装饰品: z
        .partialRecord(
          z.enum(['挂件', '摆件', '座套', '方向盘套', '遮阳板饰品', '氛围灯', '地毯', '窗帘', '其他']),
          z.string(),
        )
        .prefault({}),
    })
    .prefault({}),
});

export type Schema = z.output<typeof Schema>;