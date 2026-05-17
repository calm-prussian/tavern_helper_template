# 来心愿 (A Wish Come True) 预设

## 📋 预设简介

- **定位**：Agent 驱动的可插拔式生成预设
- **核心设计**：模块化 SKILL + 可切换流程步骤
- **命名前缀**：所有 SKILL 均以 `awct_` 开头（A Wish Come True 缩写）
- **设计理念**：把创作要求和写作指导分离，自由组合

---

## 📦 SKILL 仓库（共 8 个）

### 📏 创作要求 (Rule) - 三选一互斥

| SKILL 名 | 来源 | 核心内容 |
|----------|------|----------|
| `awct_rule_strict_v1` | 基础版 | 默认基础规则 |
| `awct_huihun_rule_core_v1` | 灰魂 | 讲述而非描写 + 去主角化 + 防全知 + 对话硬规则 + 写作戒律 |
| `awct_xiajin_rule_core_v1` | 夏瑾 | 多样性/连贯性/认知边界三原则 + NSFW零度视角 + 快感节制 |

### 🎨 写作指导 (Style) - 三选一互斥

| SKILL 名 | 来源 | 核心内容 |
|----------|------|----------|
| `awct_style_lightnovel_v1` | 基础版 | 默认轻小说文风 |
| `awct_huihun_style_strongsubject_v1` | 灰魂 | 强主观文风 + 清淡娓娓道来 + 严肃性消解 |
| `awct_xiajin_style_daily_v1` | 夏瑾 | 日常随性叙事哲学 + 不预设终点 + 抛弃因果律 + 随物赋形 |

### 🚫 其他（推荐全开，非互斥）

| SKILL 名 | 作用 |
|----------|------|
| `awct_blacklist_anti8gu_v1` | 反八股禁词表 |
| `awct_format_content_tag_v1` | 输出格式规范（content标签包裹） |

---

## 🔄 Agent 流程（14步）

### ⚠️ 互斥关系（重要！）

| 组别 | 选项 | 默认启用 | 说明 |
|------|------|---------|------|
| **创作要求组** | 3a / 3b / 3c | ✅ 3a | **只能开一个** |
| **写作指导组** | 4a / 4b / 4c | ✅ 4a | **只能开一个** |

### 完整流程说明

| 序号 | 名称 | 作用 | 互斥 |
|------|------|------|------|
| 🔘 | Agent流程开始 | 流程启动标记 `<Agent流程开始>` | 唯一启用 |
| 1 | 创建required_settings | 检查 persist/required_settings.md → 有就读，没有就创建（世界观+特殊规则） | - |
| 2 | 角色思考 | 对每个角色：检查 persist/角色名.md → 读取/创建 → 记忆检索 → 一句话思考（⚠️ 角色只能读自己的 persist！） | - |
| **3a** | 创作要求_awct | 加载 `awct_rule_strict_v1` | ✅ 默认 |
| **3b** | 创作要求_huihun | 加载 `awct_huihun_rule_core_v1` | ⚠️ 互斥 |
| **3c** | 创作要求_xiajin | 加载 `awct_xiajin_rule_core_v1` | ⚠️ 互斥 |
| **4a** | 写作指导_awct | 加载 `awct_style_lightnovel_v1` | ✅ 默认 |
| **4b** | 写作指导_huihun | 加载 `awct_huihun_style_strongsubject_v1` | ⚠️ 互斥 |
| **4c** | 写作指导_xiajin | 加载 `awct_xiajin_style_daily_v1` | ⚠️ 互斥 |
| 5 | 写草稿 | 创建草稿输出 | - |
| 6 | 逻辑检查 | 时间/空间/人物/状态/认知边界检查 | - |
| 7 | 去除禁库内容 | 加载 `awct_blacklist_anti8gu_v1` 检查违禁词 | - |
| 8 | 补全格式 | 加载 `awct_format_content_tag_v1` | - |
| 9 | 更新变量 | 更新状态变量 | - |
| 10 | 记忆更新 | 写入 persist 档案 | - |
| 11 | 最后的检查 | 全局自检 | - |
| 12 | 提交并终止Agent | 输出最终结果 | - |
| 🔘 | Agent流程结束 | 流程结束标记 | 唯一启用 |

---

## 🎯 推荐组合方案

| 组合 | 创作要求 | 写作指导 | 风格定位 |
|------|---------|---------|---------|
| **A（默认）** | 3a awct | 4a awct | 轻小说入门 |
| **B（反八股）** | 3b huihun | 4b huihun | 灰魂纯主观叙述（反八股效果最强） |
| **C（随性）** | 3c xiajin | 4c xiajin | 夏瑾日常随性（不预设结局，自然流动） |
| **D（混搭1）** | 3b huihun | 4a awct | 灰魂规则 + 轻小说文风 |
| **E（混搭2）** | 3c xiajin | 4b huihun | 夏瑾NSFW规则 + 强主观叙述 |

---

## 💾 存储设计（核心！）

这是「来心愿」预设最关键的设计思想：**客观与主观完全分离**。

### 📁 persist/ 目录结构

```
persist/
├── required_settings.md   # 全局客观设定（所有角色都能读）
│                         # 世界观、场景设定、特殊规则
│                         # 跨轮次保留，第一次运行时创建
│
├── 角色A.md              # 角色A的记忆、状态、知道的情报（只有A能读！）
├── 角色B.md              # 角色B的记忆、状态、知道的情报（只有B能读！）
└── ...                   # 其他角色各自独立的记忆库
```

### 🔒 访问权限规则

| 文件 | 谁能读 | 内容类型 | 跨轮保留 |
|------|--------|---------|---------|
| `persist/required_settings.md` | **所有角色** | 客观、全局、世界观、特殊规则 | ✅ 是 |
| `persist/角色A.md` | **只有角色A** | 主观记忆、个人情报、心理状态 | ✅ 是 |
| `persist/角色B.md` | **只有角色B** | 主观记忆、个人情报、心理状态 | ✅ 是 |

### 💡 设计亮点

1. **天然信息差**：角色绝对看不到其他角色的 persist 文件，戏剧张力自动产生
2. **真相隐藏**："真凶是谁"这种信息只存在凶手自己的 persist 里
3. **主观分离**：同一事件，不同角色可能有不同认知和记忆，分别存在各自的 persist
4. **世界观持久化**：required_settings 只在第一轮创建，后续轮次沿用

---

## 📁 目录结构

```
预设_来心愿/
├── index.yaml                      # 预设主文件
├── README.md                       # 本文档
├── 步骤/                           # 流程步骤文件（18个）
│   ├── Agent流程开始.txt
│   ├── 1 创建required_settings.txt
│   ├── 2 角色思考.txt
│   ├── 3a 创作要求_awct.txt
│   ├── 3b 创作要求_huihun.txt
│   ├── 3c 创作要求_xiajin.txt
│   ├── 4a 写作指导_awct.txt
│   ├── 4b 写作指导_huihun.txt
│   ├── 4c 写作指导_xiajin.txt
│   ├── 5 写草稿.txt
│   ├── 6 逻辑检查.txt
│   ├── 7 去除禁库内容.txt
│   ├── 8 补全格式.txt
│   ├── 9 更新变量.txt
│   ├── 10 记忆更新.txt
│   ├── 11 最后的检查.txt
│   ├── 12 提交并终止Agent.txt
│   └── Agent流程结束.txt
├── 我们的SKILL/                     # SKILL 源码（8个）
│   ├── awct_rule_strict_v1/
│   ├── awct_huihun_rule_core_v1/
│   ├── awct_xiajin_rule_core_v1/
│   ├── awct_style_lightnovel_v1/
│   ├── awct_huihun_style_strongsubject_v1/
│   ├── awct_xiajin_style_daily_v1/
│   ├── awct_blacklist_anti8gu_v1/
│   └── awct_format_content_tag_v1/
└── 打包的SKILL/                   # SKILL 安装包（8个.ttskill）
    ├── awct_rule_strict_v1.ttskill
    ├── awct_huihun_rule_core_v1.ttskill
    ├── awct_xiajin_rule_core_v1.ttskill
    ├── awct_style_lightnovel_v1.ttskill
    ├── awct_huihun_style_strongsubject_v1.ttskill
    ├── awct_xiajin_style_daily_v1.ttskill
    ├── awct_blacklist_anti8gu_v1.ttskill
    └── awct_format_content_tag_v1.ttskill
```

---

## 📝 使用说明

### 快速上手

1. **选择创作要求**：3a/3b/3c 三选一启用（推荐从 3b 开始体验反八股
2. **选择写作指导**：4a/4b/4c 三选一启用（推荐 4b 配合 3b 效果最佳）
3. **其他步骤**：保持默认启用即可
4. **开始体验**：推荐「组合B」起步（反八股效果最好）

### SKILL 安装

- `我们的SKILL/` 目录下是源码，可直接查看编辑
- `打包的SKILL/` 目录下是 `.ttskill` 安装包，可直接导入酒馆
- 所有 SKILL 均以 `awct_` 前缀命名，方便识别

### 版本迭代

- 当前所有 SKILL 均为 `_v1` 版本
- 后续更新可直接升级到 `_v2`、`_v3` 等，不影响现有版本使用

---

## 🏛️ 参考来源

- 灰魂系列 SKILL：来自「分成两半的灰魂」预设
- 夏瑾系列 SKILL：来自「夏瑾 双鱼座 Beta 0.40」预设

感谢两位创作者的优秀设计！
