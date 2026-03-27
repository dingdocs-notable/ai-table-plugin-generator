---
name: ai-table-plugin-generator
description: 钉钉AI表格插件开发专家，生成可直接运行的生产级代码。当用户需要"创建脚本"、"生成表格代码"、"写自动化脚本"、"创建边栏插件"、"生成表格UI"、"构建插件界面"、"创建AI字段"、"生成AI 字段"、"构建FaaS字段插件"，或涉及"字段操作"、"记录处理"、"事件监听"、"数据展示"、"API集成"等场景时使用。支持三种插件类型：脚本插件（TypeScript自动化）、边栏插件（React双页架构）和 AI 字段（FaaS版，Node.js行级数据处理，适用于基于当前行数据的分析处理及引用值变更时自动更新的场景）。
license: MIT
metadata:
  author: AI Table Team
  version: 1.0.0
  category: development
  tags: [ai-table, script-generation, sidebar-plugin, field-decorator, faas, automation, react, typescript]
---

# AI Table Plugin Generator

钉钉AI表格（DingTalk AI Table）插件开发助手，支持三种插件类型：

1. **脚本插件（Script Plugin）**：TypeScript 自动化脚本，用于数据批处理、字段操作、按钮触发等
2. **边栏插件（Sidebar Plugin）**：React + TypeScript 双页架构 UI 插件，用于复杂交互界面
3. **AI 字段（Field Decorator）**：Node.js 函数，运行在字段级别，接收当前行的数据作为输入，执行自定义业务逻辑（可调用外部 API），返回单元格值写入 AI 表格。适用于基于当前行数据的分析处理，以及当引用字段值变更时需要自动更新结果的场景

## Instructions

### Step 1: 判断插件类型

根据用户需求判断应该生成哪种类型的插件：

**选择脚本插件** 当用户：
- 说"创建脚本"、"生成表格代码"、"写自动化脚本"
- 需要数据操作：增删改查、批量处理、数据校验
- 需要按钮触发的自动化
- 不需要复杂 UI，只需简单输入/输出

**选择边栏插件** 当用户：
- 说"创建边栏插件"、"生成表格UI"、"构建插件界面"
- 需要复杂 UI：表单、表格、图表、实时展示
- 需要事件驱动交互：选区变化、记录修改监听
- 需要持久化的侧边栏界面

**选择 AI 字段** 当用户：
- 说"创建AI字段"、"生成AI字段"、"构建FaaS字段插件"
- 需要行级数据处理：每条记录独立执行，只访问当前行数据
- 需要基于当前行数据进行分析或计算
- 需要调用外部 API 对当前行的字段数据进行处理或转换
- 需要在引用字段值变更时自动更新结果
- 需要将处理结果写回到 AI 表格的单元格中

如果意图不明确，主动询问：
- "你需要一个简单的自动化脚本、一个带 UI 界面的边栏插件，还是一个处理行级数据的 AI 字段？"
- "这个功能需要可视化界面吗？还是只做数据处理？"
- "这个功能是针对每行记录独立处理（适合 AI 字段），还是需要批量操作整个表格（适合脚本插件）？"

### Step 2: 读取对应的子 Skill 文档

确定插件类型后，**必须先读取对应的 SKILL.md** 获取完整的生成指导：

**脚本插件** → 读取以下文档：
- `ai-script-generator/SKILL.md` — 完整的脚本生成工作流和代码模式
- `ai-script-generator/references/` — 脚本专属示例和 API 速查

**边栏插件** → 读取以下文档：
- `ai-sidebar-plugin-generator/SKILL.md` — 完整的边栏插件生成工作流
- `ai-sidebar-plugin-generator/references/` — UI 开发指南、事件模块、发布指南
- `ai-sidebar-plugin-generator/assets/addon-demo-main/` — 完整的工程化 Demo 模板

**AI 字段** → 读取以下文档：
- `ai-field-decorator-generator/SKILL.md` — 完整的AI 字段生成工作流和代码模式
- `ai-field-decorator-generator/references/AI表格 AI 字段开发指南（FaaS版）.md` — 完整开发指南
- `ai-field-decorator-generator/references/core.md` — 核心概念和项目结构
- `ai-field-decorator-generator/references/formItems.md` — FormItem 组件参考
- `ai-field-decorator-generator/references/execute.md` — Execute 函数、context API、授权
- `ai-field-decorator-generator/references/resultType.md` — ResultType 定义
- `ai-field-decorator-generator/references/i18n.md` — 国际化指南
- `ai-field-decorator-generator/assets/demo/` — 完整的AI 字段工程化 Demo 模板

**共享 API 文档**（脚本插件和边栏插件需要参考）：
- `shared/references/api/modules/` — Base、Sheet、Field、Record、View 等模块 API
- `shared/references/api/interface/` — 类型定义和字段值结构

### Step 3: 查阅 API 文档

在编写代码前，**必须查阅相关的 API 文档**确保方法签名正确：

| 操作类型 | 参考文档 |
|---------|---------|
| 数据表操作 | `shared/references/api/modules/Sheet 模块.md` |
| 字段操作 | `shared/references/api/modules/Field 模块.md` + `Field api/[字段类型].md` |
| 记录操作 | `shared/references/api/modules/Record 模块.md` |
| 用户输入（脚本） | `ai-script-generator/references/api/Input模块.md` |
| 日志输出（脚本） | `ai-script-generator/references/api/Output模块.md` |
| 事件监听（边栏） | `ai-sidebar-plugin-generator/references/Event事件模块.md` |
| 类型定义 | `shared/references/api/interface/API 类型定义.md` |
| 字段值结构 | `shared/references/api/interface/字段类型结构.md` |
| FormItem 组件（AI 字段） | `ai-field-decorator-generator/references/formItems.md` |
| Execute 函数（AI 字段） | `ai-field-decorator-generator/references/execute.md` |
| ResultType 定义（AI 字段） | `ai-field-decorator-generator/references/resultType.md` |
| 国际化（AI 字段） | `ai-field-decorator-generator/references/i18n.md` |

**关键规则**：绝不使用文档中未记录的 API。如果某个方法不在文档中，则它不存在。

### Step 4: 生成代码

按照对应子 Skill 中的工作流生成代码：
- 脚本插件：遵循 `ai-script-generator/SKILL.md` 中的 Phase 3
- 边栏插件：遵循 `ai-sidebar-plugin-generator/SKILL.md` 中的 Phase 3-5
- AI 字段：遵循 `ai-field-decorator-generator/SKILL.md` 中的 Phase 3-5

**代码质量要求**：
1. 所有异步操作必须包含 try-catch 错误处理
2. 批量操作遵守限制（插入最多 500 条/次，更新最多 100 条/次）
3. 大数据集使用游标分页加载
4. 使用 `Base.isFieldOfType()` 进行类型安全的字段操作
5. 不硬编码数据表名、字段名或凭证信息
6. （AI 字段）`resultType` 声明必须与 `execute` 返回数据类型一致
7. （AI 字段）所有用户可见文本需支持 i18n（zh-CN、en-US、ja-JP）
8. （AI 字段）调用外部 API 必须声明域名白名单，使用授权模式而非硬编码密钥

## Examples

### Example 1: 用户要求创建数据处理脚本

用户说："帮我写一个脚本，把表格里所有空的状态字段自动填上'待处理'"

**判断**：这是一个数据批量更新需求 → **脚本插件**

**操作**：
1. 读取 `ai-script-generator/SKILL.md`
2. 查阅 `shared/references/api/modules/Field api/SingleSelectField 单选字段.md`
3. 生成包含 `Input.formAsync` 表单配置 + 批量更新逻辑的 TypeScript 脚本

### Example 2: 用户要求创建边栏插件

用户说："我想做一个边栏插件，实时显示当前表格的统计数据"

**判断**：需要持久化 UI + 实时数据更新 → **边栏插件**

**操作**：
1. 读取 `ai-sidebar-plugin-generator/SKILL.md`
2. 参考 `ai-sidebar-plugin-generator/assets/addon-demo-main/` 的工程结构
3. 生成 service.ts（数据聚合逻辑）+ ui.tsx（统计展示界面）+ script.tsx（初始化）

### Example 3: 用户要求初始化边栏插件项目

用户说："帮我搭建一个边栏插件的项目"

**判断**：需要完整的工程化项目 → **边栏插件项目初始化**

**操作**：
1. 引导用户使用 `ai-sidebar-plugin-generator/assets/addon-demo-main/` 作为项目模板
2. 该模板是官方 Demo（来源：https://github.com/dingdocs-notable/addon-demo），包含完整的工程配置
3. 指导用户执行 `pnpm install` → `pnpm start` 启动开发

### Example 4: 用户要求创建 AI 字段

用户说："创建一个 AI 字段，根据当前行的金额和状态字段，自动计算优先级"

**判断**：行级数据处理，基于当前行多个字段进行计算 → **AI 字段**

**操作**：
1. 读取 `ai-field-decorator-generator/SKILL.md`
2. 查阅 `ai-field-decorator-generator/references/formItems.md`（FieldSelect 组件）和 `ai-field-decorator-generator/references/resultType.md`（SingleSelect 返回类型）
3. 生成包含 FieldSelect（选择金额和状态字段）+ SingleSelect resultType（高/中/低优先级选项）+ execute 逻辑的 `index.ts`

### Example 5: 用户要求创建调用外部 API 的 AI 字段

用户说："生成一个 AI 字段，调用外部 API 根据当前行的产品 ID 获取实时库存数据"

**判断**：行级数据处理 + 外部 API 调用 → **AI 字段**

**操作**：
1. 读取 `ai-field-decorator-generator/SKILL.md`
2. 查阅 `ai-field-decorator-generator/references/execute.md`（context.fetch、域名白名单、授权模式）
3. 生成包含域名白名单声明 + FieldSelect（选择产品 ID 字段）+ Number resultType + context.fetch 调用库存 API 的 `index.ts`

### Example 6: 用户要求初始化AI 字段项目

用户说："帮我搭建一个 AI 字段的项目"

**判断**：需要完整的工程化项目 → **AI 字段项目初始化**

**操作**：
1. 引导用户使用 `ai-field-decorator-generator/assets/demo/` 作为项目模板
2. 该模板是官方 Demo（来源：https://github.com/dingdocs-notable/field-decorator-demo），包含完整的工程配置
3. 指导用户执行 `npm install` → `npm run start` 启动本地开发
4. 引导用户在 AI 表格中通过"插件 → AI 字段开发助手 → FaaS 调试"进行调试

## Directory Structure

```
ai-table-plugin-generator/
├── SKILL.md                              # 本文件 - 入口和路由
├── ai-script-generator/                  # 脚本插件生成
│   ├── SKILL.md                          # 脚本生成完整工作流
│   ├── references/                       # 脚本开发指南和 API 速查
│   │   ├── api/
│   │   │   ├── Input模块.md              # 用户输入 API（脚本专属）
│   │   │   └── Output模块.md             # 日志输出 API（脚本专属）
│   │   └── examples/                     # 脚本示例和 manifest 模板
│   └── assets/
│       └── manifest-template.json        # manifest.json 模板
├── ai-sidebar-plugin-generator/          # 边栏插件生成
│   ├── SKILL.md                          # 边栏插件生成完整工作流
│   ├── references/                       # 边栏开发指南
│   │   ├── AI表格边栏插件 开发指南.md
│   │   ├── Event事件模块.md
│   │   ├── 核心知识.md
│   │   ├── 其他接口.md
│   │   ├── AI 表格插件 - 企业内插件发布指南.md
│   │   └── ISV接入AI表格开放API.md
│   └── assets/
│       ├── addon-demo-main/              # 完整的边栏插件工程化 Demo 模板
│       │   ├── src/entries/script.tsx     # 脚本服务入口
│       │   ├── src/entries/ui.tsx         # UI 页面入口
│       │   ├── src/script/service.ts     # 服务层（数据操作）
│       │   ├── src/components/App.tsx    # 主应用组件
│       │   ├── config/                   # Webpack 构建配置
│       │   ├── manifest.json             # 插件清单
│       │   └── package.json              # 依赖管理
│       └── examples/                     # 边栏插件代码示例
├── ai-field-decorator-generator/         # AI 字段生成
│   ├── SKILL.md                          # AI 字段生成完整工作流
│   ├── references/                       # AI 字段开发指南
│   │   ├── AI表格 AI 字段开发指南（FaaS版）.md  # 完整开发指南
│   │   ├── core.md                       # 核心概念和项目结构
│   │   ├── formItems.md                  # FormItem 组件参考
│   │   ├── execute.md                    # Execute 函数、context API、授权
│   │   ├── resultType.md                 # ResultType 定义
│   │   └── i18n.md                       # 国际化指南
│   └── assets/
│       └── demo/                         # 完整的AI 字段工程化 Demo 模板
│           ├── package.json              # 依赖管理（dingtalk-docs-cool-app）
│           ├── tsconfig.json             # TypeScript 配置
│           ├── config.json               # 本地调试授权配置
│           └── src/
│               └── index.ts              # 项目入口文件
└── shared/                               # 共享 API 文档
    ├── SKILL.md                          # 共享模块概览
    └── references/api/                   # 完整 API 参考
        ├── 读写AI 表格模型.md
        ├── interface/                    # 类型定义
        │   ├── API 类型定义.md
        │   └── 字段类型结构.md
        └── modules/                      # 各模块 API
            ├── Base 模块.md
            ├── Sheet 模块.md
            ├── Field 模块.md
            ├── Record 模块.md
            ├── View 模块.md
            ├── UI 模块.md
            └── Field api/                # 各字段类型专属 API
```

## Troubleshooting

### 问题：不确定用户需要哪种插件类型
**原因**：用户描述模糊，如"帮我做一个表格功能"
**解决**：主动询问是否需要 UI 界面。如果只是数据处理用脚本插件，如果需要交互界面用边栏插件。

### 问题：生成的代码使用了不存在的 API
**原因**：未查阅 API 文档就编写代码
**解决**：在生成代码前，必须先读取 `shared/references/api/` 中对应模块的文档，确认方法签名和参数。

### 问题：批量操作报错或超时
**原因**：单次操作记录数超过限制
**解决**：插入操作每批最多 500 条，更新操作每批最多 100 条。使用循环分批处理。

### 问题：边栏插件项目如何从零开始搭建
**原因**：用户不知道如何初始化项目
**解决**：引导用户复制 `ai-sidebar-plugin-generator/assets/addon-demo-main/` 作为项目模板，执行 `pnpm install && pnpm start` 即可启动开发。

### 问题：字段值读写格式不正确
**原因**：不同字段类型有不同的值结构
**解决**：查阅 `shared/references/api/interface/字段类型结构.md` 和对应字段类型的专属文档（如 `Field api/SingleSelectField 单选字段.md`）。

### 问题：AI 字段 resultType 与 execute 返回值不匹配
**原因**：`resultType` 声明的类型与 `execute` 函数实际返回的 `data` 类型不一致
**解决**：确保两者严格匹配。例如 `resultType` 为 `FieldType.SingleSelect` 时，`execute` 必须返回 `string`（且值必须在 `options` 中定义）。查阅 `ai-field-decorator-generator/references/resultType.md`。

### 问题：AI 字段调用外部 API 失败
**原因**：未声明域名白名单，或使用了不支持的库（如 axios、got）
**解决**：必须通过 `fieldDecoratorKit.setDomainList()` 声明所有外部域名（仅域名，不含协议/路径/端口），使用 `context.fetch` 而非第三方 HTTP 库。查阅 `ai-field-decorator-generator/references/execute.md`。

### 问题：AI 字段项目如何从零开始搭建
**原因**：用户不知道如何初始化项目
**解决**：引导用户复制 `ai-field-decorator-generator/assets/demo/` 作为项目模板，执行 `npm install && npm run start` 启动本地开发。在 AI 表格中通过"插件 → AI 字段开发助手 → FaaS 调试"进行调试。
