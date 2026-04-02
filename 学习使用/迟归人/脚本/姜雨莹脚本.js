import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

// ===== 辅助常量与函数 =====

const DAYS_IN_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const WEEK_NAMES = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const EXAM_DAY_OFFSET = 67;

function offsetToDateStr(n) {
  let year = 2025, month = 9, day = 6 + n;
  while (day > DAYS_IN_MONTH[month]) {
    day -= DAYS_IN_MONTH[month];
    month++;
    if (month > 12) { month = 1; year++; }
  }
  while (day < 1) {
    month--;
    if (month < 1) { month = 12; year--; }
    day += DAYS_IN_MONTH[month];
  }
  const wd = (((5 + n) % 7) + 7) % 7;
  return `${year}年${month}月${day}日 - ${WEEK_NAMES[wd]}`;
}

function calcBranch(know, married, accepted, exam) {
  if (!accepted && exam && married) return 'BE-a';
  if (!accepted && exam && !married) return 'BE-b';
  if (know && !married && !accepted && !exam) return 'Stage-2';
  if (know && !married && accepted && !exam) return 'Stage-3';
  if (know && !married && accepted && exam) return 'Stage-3b';
  if (know && married && accepted && !exam) return 'Stage-4';
  if (know && married && accepted && exam) return 'Stage-4b';
  if (!know && married && !accepted && !exam) return 'Revenge-1';
  if (know && married && !accepted && !exam) return 'Revenge-2';
  if (!know && !married && accepted && !exam) return 'Asym-1';
  if (!know && married && accepted && !exam) return 'Asym-2';
  if (!know && !married && accepted && exam) return 'Asym-3';
  if (!know && married && accepted && exam) return 'Asym-4';
  return 'Stage-1';
}

const BRANCH_EVENTS = {
  'Stage-1': ['彩票号码', '香水残影', '联姻登门日', '名匠股票'],
  'Stage-2': ['雨中旧伞', '父亲香水展', '摊牌之夜'],
  'Stage-3': ['第一次一起做的事', '高考前的约定'],
  'Stage-3b': [],
  'Stage-4': ['姜家危机显现', '香水问世', '她说出那句话的那天'],
  'Stage-4b': ['成绩单', '香水正式发布'],
  'Revenge-1': ['报复婚姻里的第一个裂缝', '她没有离开的那个夜晚'],
  'Revenge-2': ['报复婚姻里的第一个裂缝', '她没有离开的那个夜晚'],
  'Asym-1': ['她问他为什么'],
  'Asym-2': ['她问他为什么'],
  'Asym-3': ['她问他为什么'],
  'Asym-4': ['她问他为什么'],
  'BE-a': [],
  'BE-b': [],
};

const ALL_EVENTS = [...new Set(Object.values(BRANCH_EVENTS).flat())];

// ===== Schema =====

export const Schema = z.object({
  全局: z.object({
    _天数偏移: z.coerce.number().prefault(0),
    当前日期: z.string().prefault('2025年9月6日 - 星期五'),
    当前时间: z.string().prefault('07:00'),
    关键信息: z.object({
      姜雨莹知晓重生: z.boolean().prefault(false),
      已在这一世成婚: z.boolean().prefault(false),
      姜雨莹被接纳: z.boolean().prefault(false),
      已到高考日: z.boolean().prefault(false),
    }),
    当前剧情分支: z.string().prefault('Stage-1'),
    特殊支线事件: z.object({
      进行中事件: z.string().prefault('无'),
      已结束事件: z.record(z.string().describe('事件名'), z.string().describe('结束描述')).prefault({}),
      待触发事件: z.string().prefault('无'),
      已锁定事件: z.string().prefault('无'),
      已积累影响: z.record(z.string().describe('影响编号'), z.string().describe('影响描述')).prefault({}),
    }),
  }).transform(data => {
    // 1. 高考日自动触发（不可逆）
    if (data._天数偏移 >= EXAM_DAY_OFFSET) {
      data.关键信息.已到高考日 = true;
    }

    // 2. 从天数偏移计算当前日期字符串
    data.当前日期 = offsetToDateStr(data._天数偏移);

    // 3. 从四个关键信息计算当前剧情分支
    const { 姜雨莹知晓重生, 已在这一世成婚, 姜雨莹被接纳, 已到高考日 } = data.关键信息;
    data.当前剧情分支 = calcBranch(姜雨莹知晓重生, 已在这一世成婚, 姜雨莹被接纳, 已到高考日);

    // 4. 计算待触发事件与已锁定事件
    const branch = data.当前剧情分支;
    const ended = new Set(Object.keys(data.特殊支线事件.已结束事件));
    const current = data.特殊支线事件.进行中事件;
    const branchEvents = BRANCH_EVENTS[branch] || [];

    const pending = branchEvents.filter(e => !ended.has(e) && e !== current);
    data.特殊支线事件.待触发事件 = pending.length > 0 ? pending.join('、') : '无';

    const locked = ALL_EVENTS.filter(e => !branchEvents.includes(e) && !ended.has(e) && e !== current);
    data.特殊支线事件.已锁定事件 = locked.length > 0 ? locked.join('、') : '无';

    return data;
  }),

  姜雨莹: z.object({
    当前位置: z.string().prefault('姜家 - 次卧'),
    当前衣着: z.string().prefault('待初始化'),
    当前行为: z.string().prefault('待初始化'),
  }),
});

$(() => {
  registerMvuSchema(Schema);
});
