# DingTalk AI表格插件 (Notable Addon Sample)

一个功能完整的【DingTalk AI表格】插件示例，展示如何构建具有实时数据同步、完整CRUD操作和多语言支持的插件。

## ✨ 功能特性

### 核心功能
- 🎯 **完整的AI表格操作** - 数据表、字段、记录的增删改查
- 🔄 **实时事件同步** - 监听UI操作，自动更新插件状态
- 🌍 **多语言国际化** - 支持中文、英文、日文
- 🎨 **现代化UI** - 基于DingTalk Design Desktop组件库

### 技术特性
- 📱 **响应式设计** - 适配不同屏幕尺寸
- 🔧 **TypeScript支持** - 完整的类型定义
- 🚀 **热重载开发** - 快速开发体验
- 📦 **模块化架构** - 清晰的代码组织

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **UI组件库**: DingTalk Design Desktop
- **状态管理**: React Hooks
- **构建工具**: Webpack 5
- **开发工具**: ESLint + 热重载
- **SDK集成**: dingtalk-docs-cool-app

## 📁 项目结构

```
---------------------前端示例------------------------
├── src/
│   ├── components/       # React组件
│   │   ├── App.tsx       # 主应用组件，包含configPermission初始化逻辑
│   │   ├── locales.ts    # 国际化配置
│   │   └── style.css     # 样式文件
│   ├── entries/          # 入口文件
│   │   ├── script.tsx    # 脚本入口
│   │   └── ui.tsx        # UI入口
│   └── script/           # Service Worker (后台服务)
│       └── service.ts    # 核心业务逻辑
---------------------服务端示例------------------------
└── local_server/
    ├── server.ts         # 服务端核心逻辑，处理DingTalk API请求和签名计算
    └── .env.server       # 服务端环境变量文件，存储钉钉应用凭证
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- npm/yarn/pnpm

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm start
```
应用将在 http://localhost:3000 启动（如端口被占用会自动选择下一个可用端口）

> 插件公开发布场景下需要额外启动服务端
```bash
pnpm start:server
```
服务端将在 http://localhost:3001 启动

### 构建生产版本
```bash
pnpm run build
```

## 📋 可用脚本

| 命令 | 描述 |
|------|------|
| `pnpm start` | 启动开发服务器 |
| `pnpm run build` | 构建生产版本 |
| `pnpm test` | 运行测试 |

## 🎯 核心功能说明

### 1. 数据表管理
- 查看所有数据表
- 创建新数据表
- 删除数据表
- 实时显示当前激活表

### 2. 字段管理
- 查看表字段列表
- 添加新字段
- 删除字段（保护主键）
- 字段类型显示

### 3. 记录管理
- 查看表记录
- 添加新记录
- 删除记录
- 智能显示记录内容

### 4. 事件监听
- 数据表增删事件
- 字段增删改事件
- 记录增删改事件
- 选择区域变化事件

## 🌍 国际化支持

支持以下语言：
- 🇨🇳 简体中文
- 🇺🇸 English
- 🇯🇵 日本語

语言会根据DingTalk环境自动切换。

### 开发端口
- 开发服务器: http://localhost:3000 （默认端口，如被占用会自动选择其他端口）
- 支持热重载和实时预览

## 📝 开发指南

### 添加新功能
1. 在 `src/script/service.ts` 中添加业务逻辑
2. 在 `src/components/App.tsx` 中添加UI组件
3. 更新 `src/components/locales.ts` 添加国际化文本

## 🐛 常见问题

### Q: 开发服务器启动失败？
A: 检查Node.js版本是否>=16，或者检查是否有端口冲突。默认使用3000端口，如被占用会自动选择其他可用端口。

### Q: 插件在DingTalk中不显示？
A: 确保manifest.json配置正确，检查构建输出目录。

### Q: 事件监听不生效？
A: 确认DingTalk环境支持相应的事件API。

### Q: 获取文档信息失败: PermissionError:
    Do not have permission to access this document.
    Using "Dingdocs.base.host.configPermission(agentId, corpId, timeStamp, nonceStr, signature, ['DingdocsScript.base.readWriteAll'])." to verify permission configuration information.
A: 当发布企业内插件或第三方企业插件时，需要使用 `configPermission` 进行额外鉴权，以允许插件读写AI表格数据。

本地服务端配置要求:
- `.env.server` 文件用于存储插件所属钉钉应用的身份信息（AppKey、AppSecret、AgentId、corpId）
- 运行 `pnpm start:server` 启动本地服务端来处理鉴权请求

服务端(server.ts)功能:
- 从钉钉API获取访问令牌(access token)
- 生成Jsapi Ticket(jsapiTicket)
- 计算签名(signature)用于前端配置
- 提供 `/api/configPermission` 端点供前端调用

鉴权流程:
1. 前端在 `initView` 的 `ready` 回调中自动发起鉴权请求
2. 向服务端发送请求 `/api/configPermission` 请求，服务端生成所需的鉴权参数（timeStamp、nonceStr、signature等）
4. 前端使用返回参数调用 `Dingdocs.base.host.configPermission` 完成鉴权

## 📄 许可证

本项目基于 [MIT License](./LICENSE) 开源协议。

---

更多DingTalk插件开发文档，请参考 [官方文档](https://alidocs.dingtalk.com/i/nodes/R4GpnMqJzOP0oLp6sXPBmZxx8Ke0xjE3?utm_scene=team_space&utm_medium=dingdoc_doc_plugin_card&utm_source=dingdoc_doc)。