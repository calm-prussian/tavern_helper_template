export const Schema = z.object({
  世界: z
    .object({
      第几天: z.coerce
        .number()
        .transform(value => Math.max(1, Math.floor(value)))
        .prefault(1),
      天气: z.enum(['晴天', '多云', '小雨', '暴雨']).prefault('晴天'),
      今日结算说明: z.string().prefault('新的一天尚未结算。'),
    })
    .prefault({}),

  农场: z
    .object({
      资金: z.coerce
        .number()
        .transform(value => Math.max(0, Math.floor(value)))
        .prefault(100),
      地块: z
        .record(
          z.string().describe('地块名'),
          z
            .object({
              状态: z.enum(['空闲', '种植中', '可收获']).prefault('空闲'),
              作物: z.string().prefault('无'),
              剩余生长天数: z.coerce
                .number()
                .transform(value => Math.max(0, Math.floor(value)))
                .prefault(0),
              负责员工: z.string().prefault('无'),
            })
            .prefault({}),
        )
        .prefault({})
        .transform(data =>
          _(data)
            .mapValues(plot => {
              if (plot.状态 === '空闲') {
                return {
                  ...plot,
                  作物: '无',
                  剩余生长天数: 0,
                  负责员工: plot.负责员工 === '' ? '无' : plot.负责员工,
                };
              }

              if (plot.状态 === '可收获') {
                return {
                  ...plot,
                  剩余生长天数: 0,
                  负责员工: plot.负责员工 === '' ? '无' : plot.负责员工,
                };
              }

              return {
                ...plot,
                作物: plot.作物 === '无' ? '未指定作物' : plot.作物,
                剩余生长天数: Math.max(1, plot.剩余生长天数),
                负责员工: plot.负责员工 === '' ? '无' : plot.负责员工,
              };
            })
            .value(),
        ),
    })
    .prefault({}),

  员工市场: z
    .record(
      z.string().describe('劳动力名'),
      z
        .object({
          工种: z.enum(['播种', '照料', '收获', '杂工']).prefault('杂工'),
          日薪: z.coerce
            .number()
            .transform(value => Math.max(0, Math.floor(value)))
            .prefault(10),
          体力: z.coerce
            .number()
            .transform(value => _.clamp(Math.floor(value), 0, 100))
            .prefault(100),
        })
        .prefault({}),
    )
    .prefault({}),

  已雇员工: z
    .record(
      z.string().describe('劳动力名'),
      z
        .object({
          工种: z.enum(['播种', '照料', '收获', '杂工']).prefault('杂工'),
          日薪: z.coerce
            .number()
            .transform(value => Math.max(0, Math.floor(value)))
            .prefault(10),
          体力: z.coerce
            .number()
            .transform(value => _.clamp(Math.floor(value), 0, 100))
            .prefault(100),
          当前任务: z.string().prefault('待命'),
        })
        .prefault({}),
    )
    .prefault({}),

  待处理提示: z
    .record(z.string().describe('提示名'), z.string())
    .prefault({})
    .transform(data => _(data).entries().takeRight(8).fromPairs().value()),
});
export type Schema = z.output<typeof Schema>;
