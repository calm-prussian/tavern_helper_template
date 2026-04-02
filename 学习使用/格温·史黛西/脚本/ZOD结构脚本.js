import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  世界: z.object({
    当前日期: z.string().prefault('待初始化')，
    当前时间: z.string().prefault('待初始化')，
    近期事务: z.record(z.string().describe('事务名')， z.string().describe('事务描述')).prefault({})，
})，

  格温史黛西: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v， 0， 100)).prefault(0)，
    信赖值: z.coerce.number().transform(v => _.clamp(v， 0， 100)).prefault(0)，
    露出倾向: z.coerce.number().transform(v => _.clamp(v， 0， 5)).prefault(0)，
    内心反应: z.string().prefault('待初始化')，
    当前行为: z.string().prefault('待初始化')，
    着装: z.record(z.enum(['上装'， '下装'， '内衣'， '袜子'， '鞋子'， '饰品'])，z.string().describe('服装描述')).prefault({
      上装: '待初始化'，
      下装: '待初始化'，
      内衣: '待初始化'，
      袜子: '待初始化'，
      鞋子: '待初始化'，
      饰品: '待初始化'
})，
    性器官状态: z.object({
      小穴状态: z.string().prefault('待初始化')，
      胸部状态: z.string().prefault('待初始化')，
      臀部状态: z.string().prefault('待初始化')，
      足部状态: z.string().prefault('待初始化')，
}).prefault({})，
    身份觉察度: z.coerce.number().transform(v => _.clamp(v， 0， 100)).prefault(0)，
    堕落值: z.coerce.number().transform(v => _.clamp(v， -100， 100)).prefault(-100)，
})，
});

$(() => {
registerMvuSchema(Schema);
})