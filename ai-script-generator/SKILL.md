---
name: ai-script-generator
description: Generates production-ready scripts for AI Table plugin development. Use when user asks to "create a script", "generate AI table code", "write automation script", or references specific operations like "field manipulation", "record operations", "data validation". Supports field types: text, number, date, singleSelect, multipleSelect, attachment, url, user, link, rating, progress, currency, etc. Outputs complete TypeScript code with proper API calls and manifest.json.
license: MIT
metadata:
  author: AI Table Team
  version: 1.0.0
  category: automation
  tags: [ai-table, script-generation, automation]
---

# AI Table Script Generator

Generates production-ready TypeScript scripts for AI Table (钉钉表格) plugin development. All generated scripts follow strict API compliance and include comprehensive error handling.

## Core Principles

1. **API Compliance**: Strictly follow AI Table API definitions in `references/api/` and `../shared/references/api` directory
2. **No Fabrication**: Never invent APIs or methods - only use documented interfaces
3. **Production Ready**: Include proper error handling, user feedback, and batch processing
4. **Button Trigger Support**: Scripts should support button field triggering using `Input.formAsync` with `Record` type when applicable
5. **Manifest Only When Needed**: Generate `manifest.json` only when user confirms script works and wants to publish it
6. **Script Naming**: Provide concise script names (≤10 characters) and descriptions (≤100 characters)

## Advanced Features

### Network Requests

Script plugins support making HTTP requests using the standard `fetch` API. This allows integration with external services, APIs, and data sources.

**Requirements**:
- External interfaces must support Cross-Origin Resource Sharing (CORS)
- Handle authentication (API keys, tokens, signatures) securely
- Implement proper error handling for network failures

**Example - Fetching External Data**:
```typescript
async function fetchExternalData() {
  try {
    const response = await fetch('https://api.example.com/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    Output.log('Successfully fetched data:', data);
    return data;
  } catch (error) {
    Output.error(`Network request failed: ${error.message}`);
    throw error;
  }
}
```

**Example - API Signature (Aliyun RAM)**:
For advanced use cases like signed API requests, refer to the example in `.skills/ai-script-generator/references/examples/network-requests/aliyun-ram-users.ts` which demonstrates:
- HMAC-SHA1 signature generation
- URL encoding and parameter sorting
- Pagination handling
- Crypto API usage

**Key Points**:
- Always use try-catch for network operations
- Validate response status before processing
- Handle rate limiting and retry logic appropriately
- Never hardcode sensitive credentials in generated scripts
- Use Input methods to collect authentication data from users

## Workflow

### Phase 1: Understand User Intent
Analyze user request to determine:
- **Operation type**: CRUD operations, data transformation, validation, etc.
- **Target objects**: Sheets, Fields, Records, Views
- **Data types**: Text, Number, Date, Selection, Link, Attachment, etc.
- **Button trigger requirement**: Whether the script should support button field triggering
- **Output format**: Script only or Script + Manifest + Description

**Always ask clarifying questions if intent is ambiguous:**
- "Which sheet should the script operate on?"
- "Which fields are involved?"
- "What constitutes a successful outcome?"
- "Should this script support button field triggering?"

### Phase 2: Consult API References
Before writing code, consult relevant API documentation in `references/api` and `../shared/references/api/`:

**For Field Operations:**
- `../shared/references/api/modules/Field 模块.md` - General field API
- `../shared/references/api/modules/Field api/[FieldType].md` - Type-specific methods

**For Record Operations:**
- `../shared/references/api/modules/Record 模块.md` - Record read/write
- `../shared/references/api/modules/Sheet 模块.md` - Batch operations

**For Input API (including Button Trigger):**
- `references/api/Input模块.md` - Complete Input API including Record type for button triggers

**For Output API:**
- `references/api/Output模块.md` - Output logging and error reporting

**For Type Definitions:**
- `../shared/references/api/interface/API 类型定义.md` - Type structures
- `../shared/references/api/interface/字段类型结构.md` - Field value types

**Critical Rule**: Never use undocumented APIs. If a method is not in the documentation, it does not exist.

### Phase 3: Generate Script Code

#### Template Structure
```typescript
async function main() {
  try {
    // 1. User Input Collection (use Input.formAsync for complex configurations)
    const formResult = await Input.formAsync('脚本配置', [
      // Form items for sheet, fields, parameters
    ]);

    // 2. Validation
    // Validate field types, data formats, permissions
    
    // 3. Data Processing
    // Load records, process data, generate updates
    
    // 4. Batch Operations
    // Use batch processing (max 50-100 records per call)
    
    // 5. User Feedback
    Output.log('操作完成');
  } catch (error) {
    if (error instanceof Error) {
      Output.error(`执行过程中发生错误: ${error.message}`);
    } else {
      Output.error(`执行过程中发生未知错误`);
    }
  }
}

await main();
```

#### Common Patterns

**Pattern 1: Single Field Value Update**
```typescript
const field = sheet.getField('fieldName');
if (Base.isFieldOfType(field, 'text')) {
  await field.setValueAsync(recordId, 'new value');
}
```

**Pattern 2: Batch Record Processing**
```typescript
const updates = [];
for (const record of records) {
  updates.push({
    id: record.getId(),
    fields: {
      [fieldId]: processedValue
    }
  });
}

// Batch update (max 50 per call)
const batchSize = 50;
while (updates.length > 0) {
  const batch = updates.slice(0, batchSize);
  await sheet.updateRecordsAsync(batch);
  updates.splice(0, batchSize);
}
```

**Pattern 3: Field Type Checking**
```typescript
// Always use Base.isFieldOfType for type safety
if (Base.isFieldOfType(field, 'singleSelect')) {
  const options = field.getOptions();
  // Type-safe operations
}
```

**Pattern 4: Loading All Records**

> **⚠️ TypeScript 注意**: `getRecordsAsync` 返回的 `result.cursor` 类型为 `string | undefined`（最后一页时为 `undefined`）。
> 必须使用 `result.cursor ?? ''` 进行空值兜底，否则 TypeScript 严格模式会报 TS2322 错误。

```typescript
const allRecords = [];
let hasMore = true;
let cursor = "";

while (hasMore) {
  const result = await sheet.getRecordsAsync({
    pageSize: 100,
    cursor: cursor || undefined,
  });
  allRecords.push(...result.records);
  hasMore = result.hasMore;
  cursor = result.cursor ?? '';  // cursor 可能为 undefined，必须兜底
}
```

**Pattern 5: Button Trigger Support (Record Type)**
```typescript
// 当脚本通过按钮字段触发时，使用 Record 类型可以自动填充当前记录
const formResult = await Input.formAsync('脚本配置', [
  {
    type: 'sheet',
    key: 'sheet',
    option: { label: '选择数据表' },
    required: true
  },
  {
    type: 'record',
    key: 'record',
    option: { 
      label: '选择记录',
      referenceSheet: 'sheet'  // 必须引用 Sheet 表单项
    },
    required: true
  }
]);

// 当通过按钮触发时，sheet 和 record 会自动填充为当前上下文
// 这样脚本既支持手动运行，也支持按钮触发
const sheet = formResult.sheet;
const record = formResult.record;
```

**按钮触发说明**：
- 使用 `type: 'record'` 的表单项可以让脚本支持按钮字段触发
- 当用户点击按钮运行脚本时，系统会自动填充：
  - Sheet：按钮所在的数据表
  - Record：点击按钮的那一行记录
- 如果所有必填项都能自动填充，表单会自动提交，无需用户手动操作
- 如果有必填项无法自动填充，表单会正常弹出，已识别的项会预先填入

#### Field-Specific Value Types
      label: '选择记录',
      referenceSheet: 'sheet',  // Must reference the sheet form item
      description: '手动运行时选择，按钮触发时自动填充为当前记录'
    },
    required: true
  }
]);

const sheet = formResult.sheet;
const record = formResult.targetRecord;

// When triggered by button field, the record is automatically filled
// This allows the same script to work for both manual and button execution
```

#### Field-Specific Value Types

**Text Field**: `string`
```typescript
await textField.setValueAsync(recordId, 'text value');
```

**Number Field**: `number | string`
```typescript
await numberField.setValueAsync(recordId, 123);
await numberField.setValueAsync(recordId, '123');
```

**Date Field**: `number | string`
```typescript
// Unix timestamp (milliseconds)
await dateField.setValueAsync(recordId, Date.now());
// Or date string
await dateField.setValueAsync(recordId, '2025-01-01');
```

**Single Select**: `string | {id?: string, name?: string}`
```typescript
// By option ID
await singleSelectField.setValueAsync(recordId, 'optionId');
// By option name
await singleSelectField.setValueAsync(recordId, 'Option Name');
```

**Multiple Select**: `string[] | Array<{id?: string, name?: string}>`
```typescript
await multiSelectField.setValueAsync(recordId, ['optionId1', 'optionId2']);
```

**Attachment**: `IOpenFile | IOpenFile[] | AttachmentValue | AttachmentValue[]`
```typescript
await attachmentField.setValueAsync(recordId, {
  name: 'file.pdf',
  type: 'application/pdf',
  size: 1024,
  content: base64Content
});
```

**URL**: `string | {link: string, text?: string}`
```typescript
await urlField.setValueAsync(recordId, 'https://example.com');
await urlField.setValueAsync(recordId, {
  link: 'https://example.com',
  text: 'Example Site'
});
```

**User Field**: `Array<{userId?: string, unionId?: string}>`
```typescript
await userField.setValueAsync(recordId, [
  { userId: 'user123' },
  { unionId: 'union456' }
]);
```

**Link Fields (Uni/Bidirectional)**: `{linkedRecordIds: string[]}`
```typescript
await linkField.setValueAsync(recordId, {
  linkedRecordIds: ['rec1', 'rec2']
});
```

**Rating/Progress**: `number`
```typescript
await ratingField.setValueAsync(recordId, 4);
await progressField.setValueAsync(recordId, 75);
```

**Currency**: `number | string`
```typescript
await currencyField.setValueAsync(recordId, 99.99);
```

### Phase 4: Generate Script Name and Description

After generating the script, provide:
- **Script Name**: Concise name ≤ 10 Chinese characters
- **Description**: Detailed description ≤ 100 Chinese characters explaining functionality and use cases

**Example**:
```
脚本名称：邮箱验证
脚本描述：批量验证邮箱地址格式，标记有效和无效邮箱
```

### Phase 5: Generate Manifest (When User Requests Publication)

**IMPORTANT**: Only generate `manifest.json` when user explicitly confirms:
1. The script works correctly
2. They want to publish/use it as a plugin
3. Whether it should be visible in button field configuration

#### Complete Manifest Generation Example

When generating the manifest, you must properly escape the script code using `JSON.stringify()`:

```javascript
// Step 1: Generate the TypeScript script code
const scriptCode = `async function main() {
  try {
    const formResult = await Input.formAsync('配置', [
      {
        type: 'sheet',
        key: 'sheet',
        option: { label: '选择数据表' },
        required: true
      }
    ]);

    const sheet = formResult.sheet;
    Output.log('操作完成');
  } catch (error) {
    Output.error(\`执行过程中发生错误: \${error.message}\`);
  }
}

await main();`;

// Step 2: Escape the script code using JSON.stringify()
const escapedScriptCode = JSON.stringify(scriptCode);

// Step 3: Build the complete manifest
const manifest = {
  "extensionName": "script-example",
  "extensionType": "side_view",
  "classifications": ["script"],
  "schemaVersion": "v1",
  "icon": {
    "light": "https://img.alicdn.com/imgextra/i1/O1CN01mShWFK21gvUBZei7V_!!6000000007015-55-tps-32-32.svg"
  },
  "i18nDesc": {
    "en-US": "Example script description",
    "zh-CN": "示例脚本描述"
  },
  "i18nName": {
    "en-US": "Example Script",
    "zh-CN": "示例脚本"
  },
  "i18nIntroduction": {
    "en-US": "This is an example script",
    "zh-CN": "这是一个示例脚本"
  },
  "i18nVideo": {
    "en-US": "",
    "zh-CN": ""
  },
  "i18nImage": {
    "en-US": "",
    "zh-CN": ""
  },
  "i18nHelpLink": {},
  "i18nDeveloper": {
    "en-US": "DingTalk",
    "zh-CN": "钉钉"
  },
  "manifest": {
    "base": {
      "scriptCode": escapedScriptCode,
      "buttonTrigger": true
    }
  },
  "privacyAgreement": "{}",
  "agreement": "{}"
};

// Step 4: Convert to JSON string (no need for extra stringify on manifest field)
const manifestJson = JSON.stringify(manifest, null, 2);
```

**Key Points**:
- The `scriptCode` value in `manifest.base` must be a JSON string (already escaped)
- The entire `manifest` field should be a JSON object, not a string
- Do NOT double-escape the script code or the manifest field

#### Manifest Structure
```json
{
  "extensionName": "script-unique-name",
  "extensionType": "side_view",
  "classifications": ["script"],
  "schemaVersion": "v1",
  "icon": {
    "light": "https://img.alicdn.com/imgextra/i1/O1CN01mShWFK21gvUBZei7V_!!6000000007015-55-tps-32-32.svg"
  },
  "i18nDesc": {
    "en-US": "Brief description in English",
    "zh-CN": "中文描述"
  },
  "i18nName": {
    "en-US": "Script Name",
    "zh-CN": "脚本名称"
  },
  "i18nIntroduction": {
    "en-US": "Detailed introduction in English",
    "zh-CN": "详细的中文介绍"
  },
  "i18nVideo": {
    "en-US": "",
    "zh-CN": ""
  },
  "i18nImage": {
    "en-US": "",
    "zh-CN": ""
  },
  "i18nHelpLink": {},
  "i18nDeveloper": {
    "en-US": "DingTalk",
    "zh-CN": "钉钉"
  },
  "manifest": {
    "base": {
      "scriptCode": "ESCAPED_SCRIPT_CODE_HERE",
      "buttonTrigger": true  // Set to true if script supports button triggering
    }
  },
  "privacyAgreement": "{}",
  "agreement": "{}"
}
```

#### Critical Manifest Generation Rules

1. **Script Code Escaping**: The `manifest.base.scriptCode` field must contain the script code as a JSON string using `JSON.stringify()`. This means:
   - All double quotes (`"`) must be escaped as `\"`
   - All backslashes (`\`) must be escaped as `\\`
   - Newlines must be escaped as `\n`

   **Example**:
   ```javascript
   const scriptCode = `async function main() {
     Output.log("Hello World");
   }`;
   
   // When generating manifest, use:
   const escapedScriptCode = JSON.stringify(scriptCode);
   // Result: "async function main() {\n  Output.log(\"Hello World\");\n}"
   ```

2. **Button Trigger Configuration**:
   - If the script uses `Input.formAsync` with `Record` type to support button triggering
   - Ask user: "Should this script be visible in button field configuration?"
   - If YES: Set `"buttonTrigger": true` in `manifest.base`
   - If NO: Omit `"buttonTrigger"` field

3. **Reference Official Examples**: Check `references/examples/manifest/` directory for official manifest examples:
   - `checkdup.manifest.json` - Example with buttonTrigger
   - `vote.manifest.json` - Example of button-triggered script
   - `meta.manifest.json` - Example without buttonTrigger

### Phase 6: Generate Description File (Optional)

## Examples

### Example 1: Email Validation Script
**User Request**: "Create a script to validate email addresses"

**Generated Script**:
```typescript
async function main() {
  try {
    const formResult = await Input.formAsync('邮箱验证配置', [
      {
        type: 'sheet',
        key: 'sheet',
        option: { label: '选择数据表' },
        required: true
      },
      {
        type: 'field',
        key: 'emailField',
        option: { label: '选择邮箱字段', referenceSheet: 'sheet' },
        required: true
      }
    ]);

    const sheet = formResult.sheet;
    const emailField = formResult.emailField;

    // Create validation result field
    let validationField = sheet.getField('邮箱验证结果');
    if (!validationField) {
      validationField = sheet.insertField('邮箱验证结果', 'text');
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

    const result = await sheet.getRecordsAsync({ pageSize: 100 });
    const updates = [];

    for (const record of result.records) {
      const email = record.getCellValue(emailField.getName());
      const isValid = typeof email === 'string' && emailRegex.test(email);

      updates.push({
        id: record.getId(),
        fields: {
          '邮箱验证结果': isValid ? '有效' : '无效'
        }
      });
    }

    // Batch update
    while (updates.length > 0) {
      const batch = updates.slice(0, 50);
      await sheet.updateRecordsAsync(batch);
      updates.splice(0, 50);
    }

    Output.log(`邮箱验证完成，共处理 ${result.records.length} 条记录`);
  } catch (error) {
    Output.error(`执行过程中发生错误: ${error.message}`);
  }
}

await main();
```

### Example 2: Bulk Text Replace
**User Request**: "Replace all instances of text in a field"

**Generated Script**:
```typescript
async function main() {
  try {
    const formResult = await Input.formAsync('查找替换配置', [
      { type: 'sheet', key: 'sheet', option: { label: '数据表' }, required: true },
      { type: 'field', key: 'field', option: { label: '文本字段', referenceSheet: 'sheet' }, required: true },
      { type: 'text', key: 'findText', option: { label: '查找文本' }, required: true },
      { type: 'text', key: 'replaceText', option: { label: '替换文本' }, required: false }
    ]);

    const sheet = formResult.sheet;
    const field = formResult.field;
    const findText = formResult.findText;
    const replaceText = formResult.replaceText || '';

    if (field.getType() !== 'text') {
      Output.error('只能对文本字段进行查找替换');
      return;
    }

    const result = await sheet.getRecordsAsync({ pageSize: 100 });
    const updates = [];

    for (const record of result.records) {
      const originalValue = record.getCellValue(field.getName());
      if (typeof originalValue !== 'string') continue;

      const newValue = originalValue.replace(new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replaceText);

      if (originalValue !== newValue) {
        updates.push({
          id: record.getId(),
          fields: { [field.getName()]: newValue }
        });
      }
    }

    while (updates.length > 0) {
      const batch = updates.slice(0, 50);
      await sheet.updateRecordsAsync(batch);
      updates.splice(0, 50);
    }

    Output.log(`成功替换 ${updates.length} 条记录`);
  } catch (error) {
    Output.error(`执行过程中发生错误: ${error.message}`);
  }
}

await main();
```

### Example 3: Button-Triggered Voting Script
**User Request**: "Create a voting script that can be triggered by a button to increment vote count"

**Generated Script**:
```typescript
async function main() {
  try {
    const formResult = await Input.formAsync('投票设置', [
      {
        type: 'sheet',
        key: 'targetSheet',
        option: {
          label: '选择目标数据表',
        },
        required: true,
      },
      {
        type: 'record',
        key: 'targetRecord',
        option: {
          label: '选择记录',
          referenceSheet: 'targetSheet',
        },
        required: true,
      }
    ]);
    
    const targetSheet = formResult.targetSheet;
    const record = formResult.targetRecord;
    
    // Check or create vote result field
    let voteField = targetSheet.getField('投票结果');
    if (!voteField) {
      voteField = targetSheet.insertField('投票结果', 'number');
      Output.info('已创建「投票结果」数字字段');
    } else if (!Base.isFieldOfType(voteField, 'number')) {
      Output.error('已存在名为「投票结果」的字段，但不是数字类型');
      return;
    }
    
    // Get current vote value
    let currentVoteValue = await voteField.getValueAsync(record.getId());
    currentVoteValue = Number(currentVoteValue);
    currentVoteValue = Number.isNaN(currentVoteValue) ? 0 : currentVoteValue;
    
    // Increment and update
    const newVoteValue = currentVoteValue + 1;
    const success = await voteField.setValueAsync(record.getId(), newVoteValue);
    
    if (success) {
      Output.info(`投票成功！当前投票数: ${newVoteValue}`);
      Base.ui.toast({ type: 'success', message: '投票成功，已+1' });
    } else {
      Output.error('投票失败，请稍后重试');
      Base.ui.toast({ type: 'error', message: '投票失败' });
    }
  } catch (error) {
    Output.error(`执行过程中发生错误: ${error.message}`);
  }
}

await main();
```

**Button Trigger Notes**:
- This script uses `type: 'record'` in `Input.formAsync`
- When triggered by button, `targetSheet` and `targetRecord` are automatically filled
- No user interaction needed when button-triggered
- The same script works for both manual execution and button triggering

## Common Operations Reference

### Input API
```typescript
// Text input
const text = await Input.textAsync('请输入文本');

// Select from options
const choice = await Input.selectAsync('请选择', ['选项A', '选项B', '选项C']);

// Complex form
const formResult = await Input.formAsync('配置', [
  { type: 'sheet', key: 'sheet', option: { label: '数据表' }, required: true },
  { type: 'field', key: 'field', option: { label: '字段', referenceSheet: 'sheet' }, required: true },
  { type: 'record', key: 'record', option: { label: '记录', referenceSheet: 'sheet' }, required: true },
  { type: 'text', key: 'text', option: { label: '文本' }, required: true },
  { type: 'number', key: 'number', option: { label: '数字' }, required: true },
  { type: 'select', key: 'select', option: { label: '选择', options: ['A', 'B'] }, required: true }
]);
```

**Record 类型（按钮触发支持）**：
- `type: 'record'` - 用于选择单条记录
- `option.referenceSheet` - 必须引用 Sheet 表单项的 key
- 当脚本通过按钮字段触发时，记录会自动填充为当前点击按钮的行
- 实现脚本既支持手动运行，也支持按钮快捷操作

**Important**: FormItem type values are different from field types:
- FormItem types: `sheet`, `field`, `view`, `record`, `text`, `number`, `select`
- Field types: `text`, `number`, `date`, `singleSelect`, `multipleSelect`, etc.
- When using `type: 'select'` in FormItem, it's a selector UI component, NOT a singleSelect field type
- Field type checking is done separately using `Base.isFieldOfType(field, 'singleSelect')`

### Output API
```typescript
Output.log('普通日志');
Output.info('提示信息');
Output.warn('警告信息');
Output.error('错误信息');
Output.markdown('# Markdown **formatted** text');
Output.table([{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]);
```

### Base API
```typescript
const sheets = Base.getSheets();
const sheet = Base.getActiveSheet();
const sheetById = Base.getSheet('sheetId');

// Type checking
if (Base.isFieldOfType(field, 'number')) {
  // Type-safe operations
}
```

### Network Request API
```typescript
// Basic GET request
const response = await fetch('https://api.example.com/data');
const data = await response.json();

// POST request with headers
const result = await fetch('https://api.example.com/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({ key: 'value' })
});

// Error handling
try {
  const response = await fetch('https://api.example.com/data');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  Output.log('Data fetched successfully');
} catch (error) {
  Output.error(`Network request failed: ${error.message}`);
}
```

**Advanced Pattern - Signed API Requests**:
For APIs requiring signature (like Aliyun RAM), refer to `.skills/ai-script-generator/references/examples/network-requests/aliyun-ram-users.ts` for:
- HMAC-SHA1 signature generation using Web Crypto API
- URL encoding and parameter sorting
- Pagination handling
- Secure credential management

### Sheet API
```typescript
const fields = sheet.getFields();
const field = sheet.getField('fieldName');
const records = await sheet.getRecordsAsync({ pageSize: 100 });
await sheet.insertRecordsAsync([{ fields: { 'field': 'value' } }]);
await sheet.updateRecordsAsync([{ id: 'recId', fields: { 'field': 'newValue' } }]);
await sheet.deleteRecordsAsync(['recId1', 'recId2']);
```

**Important Notes**:
- **Field Identifiers**: In `insertRecordsAsync` and `updateRecordsAsync`, field identifiers can be either field IDs or field names. Use field names for simplicity.
- **insertField**: Use `sheet.insertField('fieldName', 'fieldType')` with separate parameters, NOT object form like `insertField({ name, type })`.
- **No addRecordsAsync or addFieldAsync**: These methods don't exist. Use `insertRecordsAsync` and `insertField` instead.

## Examples

### Example 1: 批量填充空字段

用户说："帮我写一个脚本，把所有空的状态字段填上'待处理'"

**操作步骤**：
1. 查阅 `../shared/references/api/modules/Field api/SingleSelectField 单选字段.md` 确认单选字段 API
2. 使用 `Input.formAsync` 让用户选择数据表和目标字段
3. 分页加载所有记录，筛选出目标字段为空的记录
4. 批量更新（每批 50 条）

**关键代码模式**：
```typescript
const formResult = await Input.formAsync('配置', [
  { type: 'sheet', key: 'sheet', option: { label: '选择数据表' }, required: true },
  { type: 'field', key: 'statusField', option: { label: '选择状态字段', referenceSheet: 'sheet' }, required: true }
]);
```

### Example 2: 按钮触发的单条记录操作

用户说："做一个投票脚本，点按钮给当前行+1"

**操作步骤**：
1. 使用 `type: 'record'` 表单项支持按钮触发
2. 查阅 `references/api/Input模块.md` 确认 Record 类型用法
3. 读取当前值 → 加 1 → 写回

**关键点**：使用 `referenceSheet` 关联 Sheet 表单项，按钮触发时自动填充记录

### Example 3: 数据校验脚本

用户说："检查表格里有没有重复的邮箱"

**操作步骤**：
1. 查阅 `../shared/references/api/modules/Field api/EmailField 邮箱字段.md`
2. 加载所有记录，提取邮箱字段值
3. 用 Map 统计重复项
4. 使用 `Output.table()` 输出重复记录列表

### Example 4: 跨表数据同步

用户说："把A表的数据同步到B表"

**操作步骤**：
1. 使用两个 `type: 'sheet'` 表单项让用户选择源表和目标表
2. 加载源表所有记录和字段
3. 匹配目标表字段（按名称）
4. 批量插入到目标表（每批 500 条）

### Example 5: 生成 manifest.json 发布脚本

用户说："脚本写好了，帮我生成 manifest"

**操作步骤**：
1. 参考 `./references/examples/manifest/` 目录下的官方示例
2. 使用 `JSON.stringify()` 转义脚本代码放入 `manifest.base.scriptCode`
3. 如果脚本支持按钮触发，设置 `manifest.base.buttonTrigger: true`
4. 填写 i18n 字段（名称、描述、介绍）

## Troubleshooting

### Common Errors

**Error: "Service hook unregistered"**
- Cause: Using undocumented API methods
- Solution: Only use documented APIs from `references/api/` and  `../shared/references/api` directory

**Error: "xxx.addRecordsAsync is not a function"**
- Cause: Using non-existent API method
- Solution: Use `insertRecordsAsync` instead of `addRecordsAsync`

**Error: "xxx.addFieldAsync is not a function"**
- Cause: Using non-existent API method
- Solution: Use `insertField` instead of `addFieldAsync`

**Error: "xxx.insertField is not a function" with object parameter**
- Cause: Using wrong parameter format: `insertField({ name, type })`
- Solution: Use correct format: `insertField('fieldName', 'fieldType')`

**Error: FormItem type confusion**
- Cause: Confusing FormItem types with field types (e.g., using `type: 'singleSelect'` in FormItem)
- Solution: Use `type: 'select'` for FormItem selector UI, check field types separately with `Base.isFieldOfType(field, 'singleSelect')`

**Error: "Field type mismatch"**
- Cause: Incorrect value type for field
- Solution: Match value type to field type (see Field-Specific Value Types)

**Error: "Batch size exceeded"**
- Cause: Processing more than 50-100 records in one call
- Solution: Use batch processing with slice/splice

**Error: "Field not found"**
- Cause: Invalid field name or ID
- Solution: Verify field exists with `sheet.getField()` and check validity

### Validation Checklist

Before delivering generated code:
- [ ] All API calls match documentation exactly
- [ ] Field types checked with `Base.isFieldOfType()`
- [ ] Value types match field type requirements
- [ ] Batch operations limited to 50-100 records
- [ ] Error handling with try-catch
- [ ] User feedback via Output methods
- [ ] No invented or undocumented methods
- [ ] Script name is concise (≤10 Chinese characters)
- [ ] Script description is detailed (≤100 Chinese characters)
- [ ] If script uses Record type, it supports button triggering
- [ ] Manifest.json only generated when user confirms script works and wants to publish
- [ ] **Manifest.base.scriptCode properly escaped with JSON.stringify()** - This is critical!
- [ ] If script supports button trigger, manifest.base.buttonTrigger set to true
- [ ] Manifest structure matches official examples in references/examples/manifest/ directory
- [ ] Manifest includes all required fields: extensionName, extensionType, classifications, schemaVersion, icon, i18nDesc, i18nName, i18nIntroduction, i18nVideo, i18nImage, i18nHelpLink, i18nDeveloper, manifest, privacyAgreement, agreement

## Best Practices

1. **Always validate input**: Check field types, data formats, and user permissions
2. **Use batch operations**: Process records in batches of 50-100
3. **Provide feedback**: Use Output methods to inform user of progress
4. **Handle errors**: Wrap operations in try-catch blocks
5. **Type safety**: Use `Base.isFieldOfType()` before type-specific operations
6. **Avoid assumptions**: Don't assume data exists or is valid
7. **Document clearly**: Add comments explaining complex logic
8. **Test edge cases**: Handle null, undefined, empty values gracefully
9. **Support button triggers**: When appropriate, use Record type in `Input.formAsync` to enable button field triggering
10. **Separate script and manifest generation**: Generate script code first, then generate manifest.json only when user confirms it works and wants to publish
11. **Properly escape script code**: Always use `JSON.stringify()` to escape script code in `manifest.base.scriptCode`
12. **Confirm buttonTrigger setting**: Only set `buttonTrigger` to true when script is designed for button field execution
13. **Secure network requests**: Ensure external endpoints support CORS, use secure authentication, collect credentials via Input API, handle network errors gracefully
14. **Reference examples**: Check `./references/examples/` for manifest templates and network request patterns
15. **Use correct API methods**: Only use documented APIs. Common mistakes:
    - ❌ Wrong: `addRecordsAsync`, `addFieldAsync`
    - ✅ Correct: `insertRecordsAsync`, `insertField`
    - ❌ Wrong: `insertField({ name, type })`
    - ✅ Correct: `insertField('fieldName', 'fieldType')`
16. **Distinguish FormItem types from field types**: FormItem uses `type: 'select'` for selector UI, while field types include `singleSelect`, `multipleSelect`, etc.