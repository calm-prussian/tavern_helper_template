export const Schema = z
  .object({
    世界: z
      .object({
        当前时间: z.string().prefault('1848-02-20 08:30'),
        当前日期阶段: z.string().prefault('1848-02-20上午'),
        当前革命阶段: z.string().prefault('宴会风声渐紧'),
        天气: z
          .object({
            体感: z.string().prefault('阴冷'),
            天空: z.string().prefault('低云'),
            风势: z.string().prefault('微风'),
            降水: z.string().prefault('无'),
          })
          .prefault({}),
        宏观局势: z
          .object({
            政权稳定度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(82),
            群众动员度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(11),
            革命烈度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(5),
            城市秩序度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(81),
            谣言扩散度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(18),
            经济压迫感: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(84),
            饥馑焦虑度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(69),
            开火风险度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(3),
          })
          .prefault({}),
        当前主叙事焦点: z.array(z.string()).prefault(['宴会的消息开始在咖啡馆和工坊间来回传', '多数人仍先顾着工钱、面包和今天的差事']),
        近期事务: z.record(z.string().describe('事务名'), z.string()).prefault({}),
      })
      .prefault({}),

    城市: z
      .object({
        巴黎总体: z
          .object({
            通行状态: z.string().prefault('基本可通行'),
            夜间照明: z.string().prefault('正常'),
            街头集会密度: z.string().prefault('中'),
            交通受阻度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(12),
            路障扩散趋势: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(5),
          })
          .prefault({}),
        核心地点: z
          .record(
            z.string().describe('地点名'),
            z
              .object({
                控制方: z.string().prefault('未定'),
                周边戒备: z.string().prefault('未知'),
                象征风险度: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                人群压力: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                人群密度: z.string().prefault('未知'),
                武装密度: z.string().prefault('未知'),
                紧张度: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                是否发生开火: z.boolean().prefault(false),
                通行能力: z.string().prefault('未知'),
                部队机动性: z.string().prefault('未知'),
                群众停留意愿: z.string().prefault('未知'),
                政治象征度: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
              })
              .prefault({}),
          )
          .prefault({}),
        街区: z
          .record(
            z.string().describe('街区名'),
            z
              .object({
                人群动员度: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                贫困压力: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                街垒数量: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 999))
                  .prefault(0),
                巷战潜力: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                军警压力: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                围观者比例: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                谣言密度: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                消息生产速率: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                传单传播速率: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                突袭风险: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                主要口号: z.array(z.string()).prefault([]),
              })
              .prefault({}),
          )
          .prefault({}),
      })
      .prefault({}),

    派系: z
      .record(
        z.string().describe('派系名'),
        z
          .object({
            权威度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            应对速度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            强硬程度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            退让意愿: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            信息掌握度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            内部一致性: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            街头号召力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            议会影响力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            控制群众能力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            对革命失控的恐惧: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            宣传活跃度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            组织联络度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            借势能力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            对群众失控的担忧: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            生存压力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            集体愤怒: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            持续行动意愿: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            武装准备度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            对王朝忠诚度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            对市民同情度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            开火服从度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            倒向群众概率: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            中层犹豫度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            纪律性: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            街头压制力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            疲劳度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            对巷战适应度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            传闻放大能力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            传单生产速率: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            政治口号扩散度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
          })
          .prefault({}),
      )
      .prefault({}),

    事件: z
      .object({
        革命三日: z
          .record(
            z.string().describe('事件名'),
            z
              .object({
                状态: z.string().prefault('未开始'),
                烈度: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                备注: z.string().prefault(''),
                是否超出温和派控制: z.boolean().prefault(false),
                是否出现短暂缓和: z.boolean().prefault(false),
                是否触发: z.boolean().prefault(false),
                死伤震动度: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                已形成街垒潮: z.boolean().prefault(false),
                城区覆盖度: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                是否退位: z.boolean().prefault(false),
                国家机器离散度: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
                是否成形: z.boolean().prefault(false),
                合法性竞争度: z.coerce
                  .number()
                  .transform(value => _.clamp(value, 0, 100))
                  .prefault(0),
              })
              .prefault({}),
          )
          .prefault({}),
        后续接口: z
          .record(
            z.string().describe('后续议题'),
            z
              .object({
                状态: z.string().prefault('锁定'),
              })
              .prefault({}),
          )
          .prefault({}),
      })
      .prefault({}),

    历史分歧: z
      .object({
        默认历史航道: z
          .object({
            二月革命爆发: z.boolean().prefault(true),
            王朝崩溃: z.boolean().prefault(true),
            临时政府成立: z.boolean().prefault(true),
            六月危机高概率到来: z.boolean().prefault(true),
          })
          .prefault({}),
        当前偏移: z
          .object({
            偏移度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            偏移来源: z.array(z.string()).prefault(['无']),
            是否进入新世界线: z.boolean().prefault(false),
          })
          .prefault({}),
        已改写节点: z.record(z.string().describe('改写节点名'), z.string()).prefault({}),
        潜在改写预警: z.array(z.string()).prefault(['无']),
        历史锚点压力: z
          .object({
            宴会运动升级压力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(84),
            街头流血触发压力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(72),
            国民自卫军倒向压力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(51),
            王朝失控压力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(66),
            工人问题积压压力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(79),
          })
          .prefault({}),
      })
      .prefault({}),

    玩家占位: z
      .object({
        当前身份: z.string().prefault('未定'),
        所属阶层: z.string().prefault('未定'),
        当前落点: z
          .object({
            街区: z.string().prefault('未定'),
            具体地点: z.string().prefault('未定'),
          })
          .prefault({}),
        已知信息面: z
          .object({
            识字程度: z.string().prefault('未定'),
            能接触的消息源: z.array(z.string()).prefault([]),
          })
          .prefault({}),
        个人状态: z
          .object({
            体力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(100),
            饥饿度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            负伤度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            被注意程度: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
          })
          .prefault({}),
        行动力: z
          .object({
            个人影响力: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 100))
              .prefault(0),
            可号召人数: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 999))
              .prefault(0),
            可用资源: z.record(z.string().describe('资源名'), z.string()).prefault({}),
            可进入派系网络: z.array(z.string()).prefault([]),
          })
          .prefault({}),
      })
      .prefault({}),
  })
  .prefault({});

export type Schema = z.output<typeof Schema>;
