# AI Table Field Decorator Generator Skill

This Skill helps Claude generate production-ready AI field decorators (FaaS version) for AI Table (钉钉AI表格).

## Features

- ✅ **Strict API Compliance**: Only uses APIs defined in `./references/` directory
- ✅ **Production Ready**: Complete error handling with `FieldExecuteCode` and i18n support
- ✅ **Single-File Architecture**: Generates complete `index.ts` with `fieldDecoratorKit.setDecorator()`
- ✅ **Type Safety**: TypeScript development with proper type definitions
- ✅ **External API Support**: Domain whitelisting and authorization modes (HeaderBearerToken, MultiHeaderToken)
- ✅ **i18n Support**: Built-in internationalization for Chinese, English, and Japanese
- ✅ **Complete Output**: Generates index.ts with formItems, execute, resultType, and i18nMap

## What is an AI Field Decorator?

An AI field decorator (FaaS version) is a **Node.js function** that runs at the field level in AI Table. It:

1. Receives row-level field data as input (configured via `formItems` UI)
2. Executes custom business logic (optionally calling external APIs via `context.fetch`)
3. Returns cell values to be written into AI Table

Each record's execution is independent — only the current row's data is accessible.

**Common use cases**: Invoice recognition, text classification, data extraction, sentiment analysis, content generation, API data enrichment, format conversion, etc.

## Usage

### In Claude.ai

1. Upload the `.skills/ai-field-decorator-generator` folder to Claude.ai Skills settings
2. Enable the Skill
3. Describe your requirements in natural language, for example:

```
创建一个 AI 字段，可以识别文本字段中的邮箱地址并提取出来
```

```
生成一个 AI 字段，调用翻译 API 将文本翻译成英文
```

```
写一个 AI 字段，根据链接字段爬取网页标题和描述
```

### In Claude Code

1. Copy the `.skills/ai-field-decorator-generator` folder to the project's `skills/` directory
2. Claude Code will automatically load the Skill
3. State your requirements directly in the conversation

## Architecture Overview

AI field decorators use a single-file architecture:

```
User Configures Field (formItems UI)
    ↓
User Triggers Execution
    ↓
execute(context, formData) — Node.js 16.x runtime
    ↓ (optional)
External API via context.fetch
    ↓
Return { code, data } — written to AI Table cell
```

### Three Core Components

| Component | Purpose |
|-----------|---------|
| `formItems` | Define UI configuration form (Textarea, SingleSelect, MultiSelect, Radio, FieldSelect) |
| `execute` | Business logic function receiving `context` and `formData` |
| `resultType` | Declare output field type (Text, Number, SingleSelect, MultiSelect, Link, Attachment, Object) |

## Generated Output

The Skill generates the following based on your requirements:

### TypeScript Entry File (index.ts)

Contains:
- Import statements from `dingtalk-docs-cool-app`
- Domain whitelist configuration (if external APIs are needed)
- `fieldDecoratorKit.setDecorator()` with:
  - `name` — Field decorator name
  - `i18nMap` — Internationalization resources (zh-CN, en-US, ja-JP)
  - `formItems` — UI configuration form definitions
  - `resultType` — Output type declaration
  - `execute` — Business logic function
  - `authorizations` — API credential configuration (if needed)
  - `errorMessages` — Custom error message definitions (if needed)

## Supported FormItem Components

### Textarea
- Multi-line text input
- Supports field reference (`enableFieldReference: true`)
- Execute receives: `string`

### SingleSelect
- Dropdown single selection with `options: [{ key, title }]`
- Execute receives: `string` (selected option's key)

### MultiSelect
- Dropdown multi-selection with `options: [{ key, title }]`
- Execute receives: `string[]` (array of selected keys)

### Radio
- Radio button group with `options: [{ value, label }]`
- Execute receives: `string` (selected option's value)

### FieldSelect
- Field selector referencing current row data
- Supports: Text, Number, SingleSelect, MultiSelect, Link, Attachment
- Execute receives: actual cell value of the selected field

## Supported Result Types

| Type | Execute Returns | Description |
|------|----------------|-------------|
| Text | `string` | Plain text data |
| Number | `number` | Numeric data |
| SingleSelect | `string` | Single option value (must match defined options) |
| MultiSelect | `string[]` | Multiple option values |
| Link | `{ text, link }` | Link with text and URL |
| Attachment | `[{ fileName, type, url }]` | File attachments (URL must be publicly accessible) |
| Object | `{ [key]: value }` | Structured data with multiple properties |

## Common Operation Examples

### Data Extraction
```
创建一个 AI 字段，从文本中提取所有邮箱地址
```
```
生成一个 AI 字段，识别发票图片并提取金额
```

### Text Processing
```
创建一个 AI 字段，将文本翻译成英文
```
```
生成一个 AI 字段，对文本进行情感分析并返回正面/中性/负面
```

### API Integration
```
创建一个 AI 字段，调用天气 API 根据城市名返回天气信息
```
```
生成一个 AI 字段，通过链接字段调用网页解析 API 提取标题和摘要
```

### Data Transformation
```
创建一个 AI 字段，将人民币金额转换为美元
```
```
生成一个 AI 字段，根据数字字段计算税后金额
```

## External API Integration

### Domain Whitelist
```typescript
// Must declare domains before calling external APIs
fieldDecoratorKit.setDomainList(['api.example.com']);
// Rules: domain only, no protocol/path/port
```

### Authorization Modes
- **HeaderBearerToken**: Adds `Authorization: Bearer <token>` header
- **MultiHeaderToken**: Adds multiple custom headers

### Using context.fetch
```typescript
execute: async (context, formData) => {
  const response = await context.fetch('https://api.example.com/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: formData.source }),
  });
  const result = await response.json();
  return { code: FieldExecuteCode.Success, data: result.output };
}
```

## Error Handling

Generated code uses `FieldExecuteCode` for proper error reporting:

| Code | Meaning |
|------|---------|
| `FieldExecuteCode.Success` | Execution succeeded |
| `FieldExecuteCode.Error` | General failure (supports custom `errorMessage`) |
| `FieldExecuteCode.RateLimit` | API rate limit exceeded |
| `FieldExecuteCode.QuotaExhausted` | Usage quota depleted |
| `FieldExecuteCode.ConfigError` | Invalid user configuration |
| `FieldExecuteCode.InvalidArgument` | Valid config but unhandled data |

## Runtime Environment

| Parameter | Details |
|-----------|---------|
| Node.js | 16.x |
| Spec | 1 core, 1GB RAM |
| Timeout | 15 minutes |
| Unsupported libs | axios, got, bcrypt, moment, jsdom, sharp, crypto |

## Code Quality Assurance

Generated code follows these principles:

1. **API Compliance**: Only uses documented APIs and components
2. **Error Handling**: All operations return proper `FieldExecuteCode`
3. **Type Consistency**: `resultType` always matches `execute` return data type
4. **i18n Support**: All user-facing text supports zh-CN, en-US, ja-JP
5. **Secure Credentials**: Uses authorization modes instead of hardcoding keys
6. **Domain Whitelist**: All external API domains are properly declared

## Reference Documentation

The Skill includes the following reference documents:

- `references/AI表格 AI 字段开发指南（FaaS版）.md` — Full development guide
- `references/core.md` — Core concepts and project structure
- `references/formItems.md` — FormItem components reference
- `references/execute.md` — Execute function, context API, authorization
- `references/resultType.md` — ResultType definitions
- `references/i18n.md` — Internationalization guide

## Important Notes

1. **Do Not Invent APIs**: Skill strictly follows API definitions in documentation
2. **Type Must Match**: `resultType` and `execute` return data must be consistent
3. **Row-Level Only**: Each execution only accesses current row data
4. **Domain Required**: External API calls require domain whitelist declaration
5. **No Unsupported Libs**: Cannot use axios, got, moment, etc. — use `context.fetch` and `crypto-js`

## Example Conversations

### User: 创建一个 AI 字段，对文本进行情感分析

**Claude will generate:**

1. **index.ts** — Complete field decorator with:
   - FieldSelect for selecting the text field to analyze
   - SingleSelect result type with options: 正面/中性/负面
   - Execute function calling sentiment analysis API
   - i18n support for all labels
   - Domain whitelist and error handling

### User: 生成一个 AI 字段，根据链接字段提取网页信息

**Claude will generate:**

1. **index.ts** — Complete field decorator with:
   - FieldSelect for selecting the link field
   - Object result type with properties: title, description, image
   - Execute function using context.fetch to crawl and parse the URL
   - Proper error handling for network failures

## Publishing

When users mention publishing, guide them to fill out the [钉钉AI表格AI字段上架申请表单](https://alidocs.dingtalk.com/notable/share/form/v014j6OJ5jxepK0Eq3p_hERWDMS_Wqw4Upz).

## Version Information

- Version: 1.0.0
- Author: AI Table Team
- License: MIT
