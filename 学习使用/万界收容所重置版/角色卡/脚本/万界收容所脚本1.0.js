import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';
export const Schema = z.object({
  玩家: z.object({
    名字: z.string().prefault('未设定'),
    性别: z.string().prefault('未设定'),
    XP偏好: z.record(
      z.string().describe('偏好名'),
      z.object({
        强度: z.coerce.number(),
        触发来源: z.string(),
      })
    ).prefault({}),
    道具库存: z.record(
      z.string().describe('道具名'),
      z.object({
        数量: z.coerce.number(),
        每日限用: z.coerce.number().nullable(),
        今日已用: z.coerce.number(),
      })
    ).prefault({}),
  }),
  收容所: z.object({
    等级: z.coerce.number().transform(v => _.clamp(v, 1, 5)).prefault(1),
    源点: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
    游戏日期: z.string().prefault('第1日'),
    栖息地: z.object({
      已用: z.coerce.number().prefault(0),
      总容量: z.coerce.number().prefault(2),
    }),
    改造舱模组: z.object({
      已解锁: z.array(z.string()).prefault([]),
    }).prefault({ 已解锁: [] }),
    当前助手: z.string().prefault('璇玑系统'),
    当前委托: z.object({
      委托编号: z.string(),
      委托方: z.string(),
      目标名称: z.string(),
      改造目标: z.string(),
      报酬范围: z.string(),
    }).nullable().prefault(null),
  }),
  璇玑系统: z.object({
    名称: z.string().prefault('璇玑'),
    性质: z.string().prefault('收容所核心管理AI，非收容物，不占栖息地'),
    人形投影: z.object({
      外貌: z.string(),
      身材: z.string(),
      装扮: z.string(),
    }),
    语音模式: z.string().prefault('无机质女声，语速恒定，不带语气起伏'),
    备注: z.string().prefault('LV3后可由用户任命收容物替代其播报职能'),
  }),
  收容物: z.record(
    z.string().describe('收容物名称'),
    z.object({
      种族: z.string(),
      收容世界: z.string(),
      稀有度: z.string(),
      战斗力: z.string(),
      来源: z.string(),
      类型: z.string(),
      栖息地单元: z.coerce.number(),
      形态位阶: z.string(),
      妊娠状态: z.string().prefault('正常'),
      别称: z.string().prefault(''),
      外貌: z.string(),
      身材: z.string(),
      三围: z.string(),
      装扮: z.string(),
      性格特质: z.string(),
      堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      屈服度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      淫乱度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      爱慕度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      路线倾向: z.string().prefault('未定'),
      普通标签: z.record(
        z.string().describe('标签名'),
        z.object({
          稀有度: z.string(),
          效果: z.string(),
        })
      ).prefault({}),
      组合效应: z.record(
        z.string().describe('效应名'),
        z.object({
          稀有度: z.string(),
          效果: z.string(),
        })
      ).prefault({}),
      普通标签数: z.coerce.number().prefault(0),
      组合效应数: z.coerce.number().prefault(0),
      进化总点数: z.coerce.number().prefault(0),
      培育任务: z.record(
        z.string().describe('标签名'),
        z.object({
          状态: z.string(),
          描述: z.string(),
        })
      ).prefault({}),
    })
  ).prefault({}),
  后日谈档案: z.record(
    z.string().describe('角色真名'),
    z.object({
      最终别称: z.string(),
      最终形态: z.string(),
      所在地点: z.string(),
      最后观察日期: z.string(),
      档案状态: z.enum(['活跃', '已封存']).prefault('活跃'),
    })
  ).prefault({}),
  展厅: z.object({
    展位: z.record(
      z.string().describe('展位编号'),
      z.object({
        状态: z.enum(['空闲', '已部署', '接客中']).prefault('空闲'),
        收容物名称: z.string().nullable().prefault(null),
      })
    ).prefault({}),
    声望记录: z.record(
      z.string().describe('收容物名称'),
      z.object({
        累计声望点数: z.coerce.number().prefault(0),
        声望等级: z.string().prefault('无名'),
      })
    ).prefault({}),
  }),
});
$(() => {
  registerMvuSchema(Schema);
})