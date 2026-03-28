export const Schema = z.object({
  世界: z
    .object({
      当前日期: z.string().prefault('1492 DR · Eleint 17 · 午前'),
      当前地点: z.string().prefault('博德之门南侧旧遗迹深层·封印厅'),
      当前天气: z.string().prefault('遗迹内部潮冷，外界应为铅灰阴天'),
      当前落脚点: z.string().prefault('暂无，仍在遗迹中'),
      附近传闻: z
        .record(z.string().describe('传闻标题'), z.string().describe('传闻内容'))
        .transform(data => _(data).entries().takeRight(4).fromPairs().value())
        .prefault({
          里温顿盘查变严: '城门与渡口都在仔细盘查陌生人和来历不明的施法者。',
          南侧旅店涨价: '难民、佣兵与商队挤占床位，普通客房的价格也在上升。',
        }),
      周边风险: z.string().prefault('遗迹余波未散，出口不明，城防盘查严格。'),
    })
    .prefault({}),

  旅途: z
    .object({
      当前目标: z.string().prefault('离开遗迹，确认契约边界，隐藏魔女身份。'),
      当日行程: z
        .record(z.string().describe('阶段名'), z.string().describe('阶段描述'))
        .transform(data => _(data).entries().takeRight(4).fromPairs().value())
        .prefault({
          脱离封印厅: '优先确认遗迹内部的安全路线与残余法阵。',
          检查契约: '核对条款、指向和可被曲解的措辞。',
          寻找落脚处: '在天黑前找到不惹人注目的临时住宿点。',
        }),
      补给情况: z
        .record(
          z.enum(['食物', '清水', '药品', '露营材料', '伪装物资']),
          z.enum(['短缺', '勉强够用', '尚可', '充足']),
        )
        .prefault({
          食物: '短缺',
          清水: '勉强够用',
          药品: '勉强够用',
          露营材料: '短缺',
          伪装物资: '短缺',
        }),
      金钱压力: z.coerce
        .number()
        .transform(value => _.clamp(Math.round(value), 0, 100))
        .prefault(72),
      受伤情况: z.string().prefault('轻度擦伤与疲惫，暂无致命伤。'),
      携带的重要物品: z
        .record(z.string().describe('物品名'), z.string().describe('物品描述'))
        .transform(data => _(data).entries().takeRight(6).fromPairs().value())
        .prefault({
          契约羊皮纸: '被你的血和封印余波共同污染过的主从契约文书。',
          封印铜钥: '从石座暗格中掉出的旧钥匙，可能对应遗迹的其他门。',
          半满水袋: '从背包里翻出的水袋，勉强够支撑到离开遗迹。',
        }),
    })
    .prefault({}),

  魔女: z
    .object({
      真名: z.string().prefault('维蕾娜·莫尔卡斯特'),
      伪名: z.string().prefault('薇拉'),
      魔力恢复度: z.coerce
        .number()
        .transform(value => _.clamp(Math.round(value), 0, 100))
        .prefault(18),
      封印后遗症: z.string().prefault('短时眩晕、法环失衡、连续施法会引发刺痛性反噬。'),
      当前情绪: z.string().prefault('被迫克制的恼怒与高度戒备。'),
      当日研究主题: z.string().prefault('契约反转机理与封印残痕。'),
      '对{{user}}的表面评价': z.string().prefault('无知、鲁莽，但暂时还算有用。'),
      '对{{user}}的隐藏看法': z
        .string()
        .prefault('这个异乡人像一枚偏离轨道的变量，危险，却也可能成为我重返地表的唯一钥匙。'),
    })
    .transform(data => ({
      ...data,
      $魔力阶段:
        data.魔力恢复度 < 20
          ? '余烬未燃'
          : data.魔力恢复度 < 45
            ? '缓慢回潮'
            : data.魔力恢复度 < 70
              ? '可支撑中阶术式'
              : '高位术式恢复中',
    }))
    .prefault({}),

  契约: z
    .object({
      当前约束强度: z.coerce
        .number()
        .transform(value => _.clamp(Math.round(value), 0, 100))
        .prefault(74),
      已知漏洞: z
        .record(z.string().describe('漏洞名'), z.string().describe('漏洞描述'))
        .transform(data => _(data).entries().takeRight(5).fromPairs().value())
        .prefault({
          明确措辞原则: '命令必须足够清晰、具体、可执行，否则会被她以解释空间规避。',
        }),
      可执行范围: z.string().prefault('保护、协助、生存建议与有限服从；不包括自毁式命令。'),
      已触发反噬: z.boolean().prefault(false),
      契约研究进度: z.coerce
        .number()
        .transform(value => _.clamp(Math.round(value), 0, 100))
        .prefault(8),
    })
    .prefault({}),

  关系: z
    .object({
      信任: z.coerce.number().transform(value => _.clamp(Math.round(value), 0, 100)).prefault(12),
      依赖: z.coerce.number().transform(value => _.clamp(Math.round(value), 0, 100)).prefault(26),
      主导权倾向: z.coerce.number().transform(value => _.clamp(Math.round(value), 0, 100)).prefault(84),
      羞恼值: z.coerce.number().transform(value => _.clamp(Math.round(value), 0, 100)).prefault(61),
      欲求张力: z.coerce.number().transform(value => _.clamp(Math.round(value), 0, 100)).prefault(49),
      生活默契: z.coerce.number().transform(value => _.clamp(Math.round(value), 0, 100)).prefault(9),
    })
    .transform(data => {
      const closeness = Math.round((data.信任 + data.依赖 + data.生活默契) / 3);
      return {
        ...data,
        $关系阶段:
          closeness < 20
            ? '戒备同行'
            : closeness < 40
              ? '试探磨合'
              : closeness < 60
                ? '互相倚赖'
                : closeness < 80
                  ? '暧昧升温'
                  : '深度共谋',
      };
    })
    .prefault({}),

  世界接触: z
    .object({
      已见过势力: z
        .record(z.string().describe('势力名'), z.string().describe('接触描述'))
        .transform(data => _(data).entries().takeRight(6).fromPairs().value())
        .prefault({}),
      已去过地点: z
        .record(z.string().describe('地点名'), z.string().describe('地点描述'))
        .transform(data => _(data).entries().takeRight(8).fromPairs().value())
        .prefault({
          南侧旧遗迹: '封印维蕾娜的地底建筑，出口尚未完全确认。',
        }),
      已听说人物: z
        .record(z.string().describe('人物或群体名'), z.string().describe('传闻描述'))
        .transform(data => _(data).entries().takeRight(8).fromPairs().value())
        .prefault({
          不明冒险者小队: '博德之门周边偶有传闻，提到一支与怪异寄生和天外异象有关的小队。',
        }),
      低频偶遇记录: z
        .record(z.string().describe('记录名'), z.string().describe('记录描述'))
        .transform(data => _(data).entries().takeRight(6).fromPairs().value())
        .prefault({}),
    })
    .prefault({}),
});
export type Schema = z.output<typeof Schema>;
