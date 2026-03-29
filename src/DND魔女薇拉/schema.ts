export const Schema = z.object({
  世界: z
    .object({
      当前时间: z.string().prefault('未知纪元-封印解除第一日'),
      当前地点: z.string().prefault('黑焰廊柱 古地穴入口'),
      近期事务: z.record(z.string().describe('事务名'), z.string().describe('事务描述')).prefault({}),
    })
    .prefault({}),

  薇拉: z
    .object({
      契约认可度: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 100))
        .prefault(5),
      魔力状态: z.enum(['充沛', '正常', '略显疲惫', '严重透支']).prefault('略显疲惫'),
      着装: z
        .object({
          外袍: z.string(),
          内衬: z.string(),
          配饰: z.string(),
        })
        .prefault({
          外袍: '黑色魔法长裙（千年前款式，领口开阔，裙摆曳地）',
          内衬: '深紫色丝质内衬，略有磨损',
          配饰: '古典银质胸针，镶嵌一颗黑曜石',
        }),
      称号: z
        .record(
          z.string().describe('称号名'),
          z.object({
            效果: z.string(),
            薇拉自评: z.string(),
          }),
        )
        .prefault({}),
    })
    .transform(data => {
      const $认可阶段 =
        data.契约认可度 < 20
          ? '冷眼把玩'
          : data.契约认可度 < 40
            ? '勉强收编'
            : data.契约认可度 < 60
              ? '无声占有'
              : data.契约认可度 < 80
                ? '御姐失控'
                : '坦然相守';
      data.称号 = _(data.称号)
        .entries()
        .takeRight(Math.ceil(data.契约认可度 / 10))
        .fromPairs()
        .value();
      return { ...data, $认可阶段 };
    })
    .prefault({}),

  主角: z
    .object({
      物品栏: z
        .record(
          z.string().describe('物品名'),
          z.object({
            描述: z.string(),
            数量: z.coerce.number(),
          }),
        )
        .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0))
        .prefault({}),
    })
    .prefault({}),
});
export type Schema = z.output<typeof Schema>;
