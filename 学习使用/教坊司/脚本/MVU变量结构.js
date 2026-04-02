import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前地点: z.string(),
  }),

  柳如烟: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 200)),
    当前想法: z.string(),
  }),

  沈玉书: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 200)),
    当前想法: z.string(),
  }),

  赵蘅芜: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 200)),
    当前想法: z.string(),
  }),

  苏小鸢: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 200)),
    当前想法: z.string(),
  }),

  谢芸娘: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 200)),
    当前想法: z.string(),
  }),

  白鹭: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 200)),
    当前想法: z.string(),
  }),

  傅采薇: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 200)),
    当前想法: z.string(),
  }),

  阿依: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 200)),
    当前想法: z.string(),
  }),

  孙嬷嬷: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 200)),
  }),

  钱嬷嬷: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 200)),
  }),

  林大夫: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 200)),
  }),

  周红缨: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 200)),
  }),
});

$(() => {
  registerMvuSchema(Schema);
})
