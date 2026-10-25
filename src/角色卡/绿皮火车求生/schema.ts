const Attribute = z
  .object({
    数值: z.coerce.number().prefault(0),
    加值: z.coerce.number().prefault(0),
  })
  .prefault({});

const Attributes = z
  .object({
    力量: Attribute,
    敏捷: Attribute,
    体力: Attribute,
    精神: Attribute,
  })
  .prefault({});

const Item = z
  .object({
    分类: z.string().prefault('其他'),
    数量: z.coerce.number().prefault(0),
    单位: z.string().prefault(''),
  })
  .prefault({});

const Experience = z
  .object({
    当前: z.coerce.number().prefault(0),
    所需: z.coerce.number().prefault(100),
  })
  .prefault({});

const Bedroom = z
  .object({
    左铺: z.string().prefault('空'),
    右铺: z.string().prefault('空'),
  })
  .prefault({});

const Site = z
  .object({
    名称: z.string().prefault('待抵达'),
    评级: z.string().prefault('未知'),
    类型: z.string().prefault('未知'),
    状态: z.string().prefault('行驶中'),
    剩余: z.string().prefault('1小时'),
    危险度: z.string().prefault('未知'),
    已探索: z.array(z.string()).prefault([]),
    特殊规则: z.string().prefault('无'),
  })
  .prefault({});

const SiteInput = z
  .union([z.string(), Site])
  .transform(value => (typeof value === 'string' ? Site.parse({ 剩余: value }) : value))
  .prefault({});

const Pregnancy = z
  .object({
    状态: z.string().prefault('未受孕'),
    天数: z.coerce.number().prefault(0),
    父亲: z.string().prefault(''),
    显怀: z.boolean().prefault(false),
    生产记录: z.string().prefault(''),
  })
  .prefault({});

const Carriage = z
  .object({
    数量: z.coerce.number().prefault(4),
    设施: z
      .object({
        厨房: z.string().prefault('基础'),
        沐浴: z.string().prefault('基础'),
        供电: z.string().prefault('无'),
        防御: z.string().prefault('无'),
      })
      .prefault({}),
  })
  .prefault({});

const Character = z
  .object({
    身份: z.string().prefault('随车成员'),
    等级: z.coerce.number().prefault(1),
    经验: Experience,
    好感: z.coerce
      .number()
      .transform(value => _.clamp(value, 0, 100))
      .prefault(0),
    天赋: z.string().prefault('未觉醒'),
    天赋作用: z.string().prefault(''),
    容貌: z.string().prefault('未记录'),
    身材: z.string().prefault('未记录'),
    内心: z.string().prefault(''),
    状态: z.string().prefault('正常'),
    怀孕: Pregnancy,
    属性: Attributes,
  })
  .prefault({});

export const Schema = z.object({
  世界: z
    .object({
      时间: z.string().prefault('第1天 16:40'),
      位置: z.string().prefault('卧铺车厢'),
      积分: z.coerce.number().prefault(0),
      站点: SiteInput,
      繁衍协议: z.string().prefault('已激活 · 累计结合 0 次'),
      暴击: z.string().prefault(''),
    })
    .prefault({}),

  主角: z
    .object({
      等级: z.coerce.number().prefault(1),
      经验: Experience,
      称号: z.string().prefault('列车新人'),
      称号作用: z.string().prefault('无特殊效果，仅为初始身份。'),
      天赋: z.string().prefault('SSS 暴击翻倍'),
      天赋作用: z.string().prefault(''),
      属性: Attributes,
      状态: z.string().prefault('赤裸，仅一双拖鞋'),
      物品: z.record(z.string().describe('物品名'), Item).prefault({}),
    })
    .prefault({}),

  仓库: z
    .object({
      容量: z.coerce.number().prefault(30),
      物品: z.record(z.string().describe('物品名'), Item).prefault({}),
    })
    .prefault({}),

  卧铺: z
    .object({
      房间: z.record(z.string().describe('房间号'), Bedroom).prefault({}),
    })
    .prefault({}),

  车厢: Carriage,

  角色: z.record(z.string().describe('角色名'), Character).prefault({}),
});

export type Schema = z.output<typeof Schema>;
