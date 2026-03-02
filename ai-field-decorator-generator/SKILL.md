---
name: ai-field-decorator-generator
description: Generates production-ready FaaS AI field decorators for AI Table (钉钉AI表格). Use when user asks to "create an AI field", "generate a field decorator", "build a FaaS field plugin", or needs row-level data processing that auto-updates when referenced field values change. AI field decorators are Node.js functions that process row-level data through formItems (UI config), execute (business logic), and resultType (output type). Supports FormItemComponents: Textarea, SingleSelect, MultiSelect, Radio, FieldSelect. Supports ResultTypes: Text, Number, SingleSelect, MultiSelect, Link, Attachment, Object. Outputs complete TypeScript code with proper fieldDecoratorKit configuration, i18n support, and domain whitelist.
license: MIT
metadata:
  author: AI Table Team
  version: 1.0.0
  category: field-decorator
  tags: [ai-table, field-decorator, faas, nodejs, ai-field]
---

# AI Table Field Decorator Generator

Generates production-ready FaaS AI field decorators for AI Table (钉钉AI表格). AI field decorators are Node.js functions that receive row-level field data as input, execute custom business logic (optionally calling external APIs), and return cell values to be written into AI Table.

## Project Template (Quick Start)

A complete, production-ready project template is available at `./assets/demo/`. This is the official demo from [https://github.com/dingdocs-notable/field-decorator-demo](https://github.com/dingdocs-notable/field-decorator-demo), pre-configured with all necessary tooling.

### When to Use the Template

Use this template when user:
- Asks to "initialize a field decorator project", "set up a new AI field", "scaffold a field plugin"
- Needs a complete project structure with build configuration
- Wants to start developing from a working baseline

### Template Structure

```
assets/demo/
├── package.json          # Dependencies (dingtalk-docs-cool-app)
├── tsconfig.json         # TypeScript configuration
├── config.json           # Local debug authorization config
└── src/
    └── index.ts          # Project entry file
```

### How to Initialize a Project from Template

Guide users through these steps:

```bash
# 1. Copy the template to a new project directory
cp -r ./assets/demo/ /path/to/my-field-decorator

# 2. Navigate to the project
cd /path/to/my-field-decorator

# 3. Install dependencies
npm install

# 4. Start local development server
npm run start
```

### Debugging in AI Table

1. Open any AI Table document
2. Click "插件" (Plugins) to expand the plugin panel
3. Select "字段模板开发助手" (AI Field Development Assistant)
4. Choose "FaaS 调试" (FaaS Debug) mode
5. Ensure local service is running, then click "添加字段" (Add Field)
6. The AI field configuration panel will appear for testing
7. Select the FaaS field to debug and click "调试" (Debug)

**Note**: Fields created via the development assistant only trigger on the first row of the current view. Both the assistant and local service must remain running.

**Chrome HTTPS Restriction Workaround**:
```bash
# macOS
open -na "Google Chrome" --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security --disable-site-isolation-trials --disable-features=BlockInsecurePrivateNetworkRequests

# Windows
chrome.exe --disable-features=BlockInsecurePrivateNetworkRequests --disable-web-security --user-data-dir=C:\temp\chrome-dev
```

## Core Principles

1. **API Compliance**: Strictly follow AI field decorator API definitions in `./references/` directory
2. **No Fabrication**: Never invent APIs, components, or field types — only use documented interfaces
3. **Production Ready**: Include proper error handling with `FieldExecuteCode`, i18n support, and domain whitelisting
4. **Type Consistency**: `resultType` declaration must match the actual `execute` return data type — mismatches cause write failures
5. **Row-Level Isolation**: Each record's `execute` runs independently; only current row data is accessible
6. **Secure Credentials**: Use authorization modes (`HeaderBearerToken`, `MultiHeaderToken`) instead of hardcoding API keys

## Architecture Overview

AI field decorators use a single-file architecture centered on `fieldDecoratorKit.setDecorator()`:

```
User Configures Field (formItems UI)
    ↓
User Triggers Execution
    ↓
execute(context, formData) — Node.js runtime
    ↓ (optional)
External API via context.fetch (with domain whitelist)
    ↓
Return { code, data } — written to AI Table cell
```

### Core Components

| Component | Purpose | Reference |
|-----------|---------|-----------|
| `formItems` | Define UI configuration form for user input | `./references/formItems.md` |
| `execute` | Business logic function (Node.js runtime) | `./references/execute.md` |
| `resultType` | Declare the output field type | `./references/resultType.md` |
| `i18nMap` | Internationalization support (zh-CN, en-US, ja-JP) | `./references/i18n.md` |

## Workflow

### Phase 1: Understand User Intent

Analyze user request to determine:
- **Business scenario**: Data extraction, text classification, API integration, data transformation, etc.
- **Input fields**: Which field types the user needs to reference (Text, Number, SingleSelect, MultiSelect, Link, Attachment)
- **Output type**: What result type to return (Text, Number, SingleSelect, MultiSelect, Link, Attachment, Object)
- **External API**: Whether the decorator needs to call third-party APIs
- **Authorization**: Whether API credentials are required

**Always ask clarifying questions if intent is ambiguous:**
- "What data should the AI field process as input?"
- "What type of result should the AI field return?"
- "Does this require calling any external API?"
- "Should the field support multiple languages?"

### Phase 2: Consult API References

Before writing code, consult relevant documentation in `./references/`:

**For UI Configuration:**
- `./references/formItems.md` — FormItem components (Textarea, SingleSelect, MultiSelect, Radio, FieldSelect)

**For Execution Logic:**
- `./references/execute.md` — Execute function, context API, error codes, domain whitelist, authorization, runtime environment

**For Return Types:**
- `./references/resultType.md` — Result type definitions (Text, Number, SingleSelect, MultiSelect, Link, Attachment, Object)

**For Internationalization:**
- `./references/i18n.md` — i18n configuration with `i18nMap` and `t()` function

**For Complete Guide:**
- `./references/AI表格 AI 字段开发指南（FaaS版）.md` — Full development guide
- `./references/core.md` — Core concepts and project structure

**Critical Rule**: Never use undocumented APIs, components, or field types. If it's not in the documentation, it does not exist.

### Phase 3: Generate Field Decorator Code

#### Template Structure

```typescript
import { FieldType, fieldDecoratorKit, FormItemComponent, FieldExecuteCode } from 'dingtalk-docs-cool-app';
const { t } = fieldDecoratorKit;

// 1. Domain whitelist (required if calling external APIs)
fieldDecoratorKit.setDomainList(['api.example.com']);

fieldDecoratorKit.setDecorator({
  name: 'AI字段名称',

  // 2. i18n resources
  i18nMap: {
    'zh-CN': {
      'fieldLabel': '字段标签',
    },
    'en-US': {
      'fieldLabel': 'Field Label',
    },
    'ja-JP': {
      'fieldLabel': 'フィールドラベル',
    },
  },

  // 3. UI configuration form
  formItems: [
    {
      key: 'inputField',
      label: t('fieldLabel'),
      component: FormItemComponent.FieldSelect,
      props: {
        mode: 'single',
        supportTypes: [FieldType.Text],
      },
      validator: {
        required: true,
      }
    },
  ],

  // 4. Result type declaration
  resultType: {
    type: FieldType.Text,
  },

  // 5. Execute function
  execute: async (context, formData) => {
    try {
      const inputValue = formData.inputField;

      // Business logic here
      const result = processData(inputValue);

      return {
        code: FieldExecuteCode.Success,
        data: result,
      };
    } catch (error) {
      return {
        code: FieldExecuteCode.Error,
        data: null,
        msg: error.message,
      };
    }
  },
});

export default fieldDecoratorKit;
```

#### FormItem Components

**Textarea** — Multi-line text input
```typescript
{
  key: 'prompt',
  label: t('promptLabel'),
  component: FormItemComponent.Textarea,
  props: {
    placeholder: '请输入提示词',
    enableFieldReference: true, // Enable field reference in text
  },
  validator: { required: true }
}
// execute receives: formData.prompt as string
```

**SingleSelect** — Dropdown single selection
```typescript
{
  key: 'mode',
  label: t('modeLabel'),
  component: FormItemComponent.SingleSelect,
  props: {
    placeholder: '请选择',
    defaultValue: 'option1',
    options: [
      { key: 'option1', title: '选项1' },
      { key: 'option2', title: '选项2' },
    ]
  },
  validator: { required: true }
}
// execute receives: formData.mode as string (the selected option's key)
```

**MultiSelect** — Dropdown multi-selection
```typescript
{
  key: 'tags',
  label: t('tagsLabel'),
  component: FormItemComponent.MultiSelect,
  props: {
    placeholder: '请选择',
    defaultValue: ['option1'],
    options: [
      { key: 'option1', title: '选项1' },
      { key: 'option2', title: '选项2' },
      { key: 'option3', title: '选项3' },
    ]
  },
  validator: { required: true }
}
// execute receives: formData.tags as string[] (array of selected keys)
```

**Radio** — Radio button group
```typescript
{
  key: 'type',
  label: t('typeLabel'),
  component: FormItemComponent.Radio,
  props: {
    defaultValue: 'option1',
    options: [
      { value: 'option1', label: '选项1' },
      { value: 'option2', label: '选项2' },
    ]
  },
  validator: { required: true }
}
// execute receives: formData.type as string (the selected option's value)
```

**FieldSelect** — Field selector (references current row data)
```typescript
{
  key: 'sourceField',
  label: t('sourceLabel'),
  component: FormItemComponent.FieldSelect,
  props: {
    mode: 'single', // or 'multiple'
    supportTypes: [FieldType.Text, FieldType.Number],
  },
  validator: { required: true }
}
// execute receives the actual cell value of the selected field for the current row
```

#### FieldSelect Value Types by Field Type

| Field Type | execute receives | TypeScript Type |
|-----------|-----------------|-----------------|
| `FieldType.Text` | Cell text content | `string` |
| `FieldType.Number` | Cell numeric value | `number` |
| `FieldType.SingleSelect` | Selected option value | `string` |
| `FieldType.MultiSelect` | Selected option values | `string[]` |
| `FieldType.Link` | Link info | `{ url: string; text: string }` |
| `FieldType.Attachment` | Attachment info array | `Array<{ name: string; type: string; size: number; tmp_url: string }>` |

#### ResultType Definitions

**Text** — Returns string data
```typescript
resultType: { type: FieldType.Text }
// execute must return: { code: FieldExecuteCode.Success, data: 'string value' }
```

**Number** — Returns numeric data
```typescript
resultType: { type: FieldType.Number }
// execute must return: { code: FieldExecuteCode.Success, data: 123 }
```

**SingleSelect** — Returns single selection
```typescript
resultType: {
  type: FieldType.SingleSelect,
  extra: {
    options: [{ name: '选项1' }, { name: '选项2' }]
  }
}
// execute must return: { code: FieldExecuteCode.Success, data: '选项1' }
```

**MultiSelect** — Returns multiple selections
```typescript
resultType: {
  type: FieldType.MultiSelect,
  extra: {
    options: [{ name: '选项1' }, { name: '选项2' }]
  }
}
// execute must return: { code: FieldExecuteCode.Success, data: ['选项1', '选项2'] }
```

**Link** — Returns link data
```typescript
resultType: { type: FieldType.Link }
// execute must return: { code: FieldExecuteCode.Success, data: { text: 'link text', link: 'https://url' } }
```

**Attachment** — Returns attachment data
```typescript
resultType: { type: FieldType.Attachment }
// execute must return: { code: FieldExecuteCode.Success, data: [{ fileName: 'file.png', type: 'image', url: 'https://public-url' }] }
```

**Object** — Returns structured object data
```typescript
resultType: {
  type: FieldType.Object,
  extra: {
    properties: [
      { key: 'id', type: FieldType.Text, title: 'ID', hidden: true },
      { key: 'name', type: FieldType.Text, title: '名称', primary: true },
      { key: 'desc', type: FieldType.Text, title: '描述' },
    ],
    icon: { light: 'https://icon-url.png' }
  }
}
// execute must return: { code: FieldExecuteCode.Success, data: { id: '1', name: 'value', desc: 'description' } }
// Note: properties must have exactly one item with primary: true, and it cannot be hidden
```

### Phase 4: External API Integration

When the decorator needs to call external APIs:

#### Domain Whitelist (Required)
```typescript
// Must declare all external domains before use
fieldDecoratorKit.setDomainList(['api.example.com', 'data.service.com']);
// Rules:
// - Domain only (no protocol, no path, no port)
// - Supports IP addresses (IPv4 and IPv6)
// - All subdomains of the declared domain are accessible
```

#### Using context.fetch
```typescript
execute: async (context, formData) => {
  const response = await context.fetch('https://api.example.com/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: formData.inputField }),
  });
  const result = await response.json();
  return {
    code: FieldExecuteCode.Success,
    data: result.output,
  };
}
```

#### Authorization Modes

**HeaderBearerToken** — Adds `Authorization: Bearer <token>` header
```typescript
fieldDecoratorKit.setDecorator({
  authorizations: {
    id: 'my_auth',
    platform: 'MyPlatform',
    type: AuthorizationType.HeaderBearerToken,
    required: false,
    instructionsUrl: 'https://docs.example.com/api-key',
    label: 'API Key',
    tooltips: '请配置 API Key',
    icon: { light: 'https://icon.png' }
  },
  execute: async (context, formData) => {
    // Third argument is the authorization id
    const response = await context.fetch('https://api.example.com/data', {
      method: 'GET',
    }, 'my_auth');
    // ...
  }
});
```

**MultiHeaderToken** — Adds multiple custom headers
```typescript
fieldDecoratorKit.setDecorator({
  authorizations: {
    id: 'multi_auth',
    platform: 'MyPlatform',
    type: AuthorizationType.MultiHeaderToken,
    params: [
      { key: 'x-api-key', placeholder: 'API Key' },
      { key: 'x-api-secret', placeholder: 'API Secret' },
    ],
    required: false,
    instructionsUrl: 'https://docs.example.com/auth',
    label: '平台授权',
    tooltips: '请配置授权信息',
    icon: { light: 'https://icon.png' }
  },
  execute: async (context, formData) => {
    const response = await context.fetch('https://api.example.com/data', {
      method: 'POST',
    }, 'multi_auth');
    // ...
  }
});
```

### Phase 5: Error Handling

#### FieldExecuteCode Values

| Code | Meaning | When to Use |
|------|---------|-------------|
| `FieldExecuteCode.Success` | Execution succeeded | Normal successful result |
| `FieldExecuteCode.Error` | General execution failure | Unexpected errors |
| `FieldExecuteCode.RateLimit` | Rate limited | API rate limit exceeded |
| `FieldExecuteCode.QuotaExhausted` | Quota exhausted | Usage quota depleted |
| `FieldExecuteCode.ConfigError` | Configuration error | Invalid user configuration |
| `FieldExecuteCode.InvalidArgument` | Invalid argument | Valid config but unhandled data |

#### Custom Error Messages
```typescript
{
  i18nMap: {
    'zh-CN': { 'apiError': 'API 调用失败，请稍后重试' },
    'en-US': { 'apiError': 'API call failed, please retry later' },
    'ja-JP': { 'apiError': 'API呼び出しに失敗しました' },
  },
  errorMessages: {
    'api_error': t('apiError'),
  },
  execute: async (context, formData) => {
    return {
      code: FieldExecuteCode.Error,
      errorMessage: 'api_error', // Must exist in errorMessages
    };
  }
}
```

### Phase 6: Internationalization (i18n)

All user-facing text must support i18n with `zh-CN`, `en-US`, and `ja-JP`:

```typescript
i18nMap: {
  'zh-CN': {
    'inputLabel': '输入字段',
    'placeholder': '请输入内容',
  },
  'en-US': {
    'inputLabel': 'Input Field',
    'placeholder': 'Please enter content',
  },
  'ja-JP': {
    'inputLabel': '入力フィールド',
    'placeholder': '内容を入力してください',
  },
},
```

Use `t('key')` to reference i18n strings in `formItems`, `tooltips`, `errorMessages`, etc.

## Runtime Environment

| Parameter | Details |
|-----------|---------|
| Node.js Version | 16.x |
| Instance Spec | 1 core, 1GB RAM |
| Timeout | 15 minutes |
| Isolation | Per plugin + organization |
| Scaling | Dynamic scaling, max N instances |

### Runtime Restrictions

1. Max concurrent requests: 10N
2. **Unsupported libraries**: axios, got, bcrypt, moment, jsdom, sharp, crypto (use `crypto-js` instead)
3. **Sandboxed globals** (prototype chain may differ): URL, Buffer, Uint8Array, URLSearchParams

## Publishing

To publish an AI field decorator for all users, fill out the [钉钉AI表格AI字段上架申请表单](https://alidocs.dingtalk.com/notable/share/form/v014j6OJ5jxepK0Eq3p_hERWDMS_Wqw4Upz). A specialist will follow up via group chat.

For reference materials on the application form, please see `ai-field-decorator-generator/references/AI表格AI 字段上架申请表单.md`.

## Complete Example

```typescript
import { FieldType, fieldDecoratorKit, FormItemComponent, FieldExecuteCode } from 'dingtalk-docs-cool-app';
const { t } = fieldDecoratorKit;

fieldDecoratorKit.setDomainList(['api.example.com']);

fieldDecoratorKit.setDecorator({
  name: '文本分类',
  i18nMap: {
    'zh-CN': {
      'sourceField': '选择要分类的文本字段',
      'categoryLabel': '分类模式',
    },
    'en-US': {
      'sourceField': 'Select text field to classify',
      'categoryLabel': 'Classification mode',
    },
    'ja-JP': {
      'sourceField': '分類するテキストフィールドを選択',
      'categoryLabel': '分類モード',
    },
  },
  formItems: [
    {
      key: 'source',
      label: t('sourceField'),
      component: FormItemComponent.FieldSelect,
      props: {
        mode: 'single',
        supportTypes: [FieldType.Text],
      },
      validator: { required: true },
    },
    {
      key: 'mode',
      label: t('categoryLabel'),
      component: FormItemComponent.SingleSelect,
      props: {
        defaultValue: 'auto',
        options: [
          { key: 'auto', title: '自动分类' },
          { key: 'sentiment', title: '情感分析' },
        ],
      },
      validator: { required: true },
    },
  ],
  resultType: {
    type: FieldType.SingleSelect,
    extra: {
      options: [
        { name: '正面' },
        { name: '中性' },
        { name: '负面' },
      ],
    },
  },
  execute: async (context, formData) => {
    try {
      const text = formData.source as string;
      if (!text) {
        return {
          code: FieldExecuteCode.InvalidArgument,
          data: null,
          msg: 'Input text is empty',
        };
      }

      const response = await context.fetch('https://api.example.com/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode: formData.mode }),
      });

      const result = await response.json();
      return {
        code: FieldExecuteCode.Success,
        data: result.category,
      };
    } catch (error) {
      return {
        code: FieldExecuteCode.Error,
        data: null,
        msg: error.message,
      };
    }
  },
});

export default fieldDecoratorKit;
```

## Directory Structure

```
ai-field-decorator-generator/
├── SKILL.md                                              # This file
├── README.md                                             # Usage guide
├── assets/
│   └── demo/                                             # Project template
│       ├── package.json
│       ├── tsconfig.json
│       ├── config.json
│       └── src/
│           └── index.ts
└── references/
    ├── AI表格 AI 字段开发指南（FaaS版）.md                  # Full development guide
    ├── core.md                                           # Core concepts
    ├── execute.md                                        # Execute function reference
    ├── formItems.md                                      # FormItem components reference
    ├── resultType.md                                     # ResultType definitions
    └── i18n.md                                           # Internationalization guide
```
