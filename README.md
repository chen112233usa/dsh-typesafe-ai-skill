# dsh-typesafe-ai-skill

把 TypeSafe / Jev 的构建技能装进 DeepSeek Harness，每个会话自动可用。

## 这个插件做什么

它在 Harness 的**全局技能层**注册一个名为 `typesafe-ai` 的技能。因为注册来自主机行而不是某个 agent preset，所有会话——包括以后新建的会话——都能看到它，不需要每个 preset 各配一遍。

技能本身教模型怎么用 TypeSafe 的 **System One** 判断模型（旗舰模型是 **Jev**）：把自然语言和应用状态转成带类型的判断和概率，代码可以直接 `if` 它，不用再「调大模型 → 解析回复」。

三种原语：

| 原语 | 回答什么 | 返回 |
| --- | --- | --- |
| **Noul** | 某个条件成不成立 | 0–1 的概率 |
| **Choice** | 从定义的选项里选一个 | 选中项 + 各项概率 + 置信度 |
| **Score** | 沿有序等级打一个分 | 概率加权位置 + 等级图例 |

适用场景：给消息/工单/请求分类或路由、按某个维度打分排序、判断意图与紧急度、从自由文本抽取值、用置信度决定能否自动处理、拿不准转人工。

## 安装

```sh
dsh plugin --profile web add github:chen112233usa/dsh-typesafe-ai-skill
```

装完技能即刻可用。**不需要重启**：技能注册在挂载时完成，目录会自己刷新。

## 配置 API key

**本插件不含任何密钥**，密钥由使用者自己提供。先去 <https://openrouter.ai/keys> 建一把，然后在**启动 dsh 之前**导出：

```bash
export OPENROUTER_API_KEY=sk-or-v1-...        # macOS / Linux
```

```powershell
$env:OPENROUTER_API_KEY = "sk-or-v1-..."      # Windows PowerShell
```

技能里的所有示例代码和 curl 命令都从这个环境变量读密钥，所以密钥不会被写进任何文件、提示词或提交记录。忘记配置时调用会返回 `401`，技能文档的排错表里有这一条。

## 技能内容

`SKILL.md` 是技能本体，也是这个仓库真正的主体。前半部分是给模型的行为指令（怎么从用户目标倒推judgment、怎么设计问题、怎么用置信度），后半部分是**实测过的部署配置**：端点、模型 ID、三种原语的 schema、curl / Node / PHP 调用示例，以及踩过的坑——比如 `Choice.criteria` 收对象而 `Score.criteria` 收对象数组，传反就是 400。

技能每次加载都会提示模型去读实时文档（<https://docs.typesafe.ai>），所以版本相关的细节以官方文档为准，而不是以本仓库为准。

## 插件本身的行为边界

- 只读取与自己同目录的 `SKILL.md`，然后调用 Harness 的技能注册接口。
- **自己不发起任何网络请求。** 联网调用是技能教给模型做的事，用的是使用者自己的 key。
- 卸载后注册随之撤销，技能目录立即恢复原状。

## 不装插件也能用

`SKILL.md` 是自包含的，不依赖 Harness 的任何特性。把它全文贴进任意平台的系统提示或技能目录即可：Claude Code 放到 `~/.claude/skills/typesafe-ai/SKILL.md`，ChatGPT Projects / Gemini Gems 直接粘进指令栏。装成插件只是省掉手工步骤，并让它在每个会话里自动出现。

## 卸载

```sh
dsh plugin --profile web remove dsh-typesafe-ai-skill
```

## 许可

MIT。技能内容源自 TypeSafe 官方插件，部署配置由实际调用线上 API 验证后整理。

**插件由 陈先生Cool 研发，允许全网全球免费使用。**
