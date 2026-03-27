---
name: ai-sidebar-plugin-generator
description: Generates production-ready sidebar plugins for AI Table (钉钉AI表格). Use when user asks to "create a sidebar plugin", "generate AI Table UI", "build plugin interface", or references specific UI features like "button triggers", "event listeners", "data display", "form interactions". Supports React-based UI with TypeScript, dual-page architecture (Service + UI), event monitoring, and real-time data interactions. Outputs complete code: service.ts, ui.tsx, script.tsx with proper API usage.
license: MIT
metadata:
  author: AI Table Team
  version: 1.0.0
  category: ui-development
  tags: [ai-table, sidebar-plugin, react, typescript, event-handling]
---

# AI Table Sidebar Plugin Generator

Generates production-ready sidebar plugins for AI Table (钉钉AI表格) with React-based UI, TypeScript support, and dual-page architecture. All generated plugins follow strict API compliance and include comprehensive error handling, event monitoring, and user interactions.

## Project Template (Quick Start)

A complete, production-ready project template is available at `./assets/addon-demo-main/`. This is the official demo from [https://github.com/dingdocs-notable/addon-demo](https://github.com/dingdocs-notable/addon-demo), pre-configured with all necessary tooling.

### When to Use the Template

Use this template when user:
- Asks to "initialize a sidebar plugin project", "set up a new plugin", "scaffold a plugin"
- Needs a complete project structure with build configuration
- Wants to start developing from a working baseline

### Template Structure

```
assets/addon-demo-main/
├── src/
│   ├── entries/
│   │   ├── script.tsx          # Script service entry - initializes Web Worker
│   │   └── ui.tsx              # UI entry - renders React app
│   ├── script/
│   │   └── service.ts          # Service layer - AI Table data operations (CRUD)
│   └── components/
│       ├── App.tsx             # Main React component with full CRUD demo
│       ├── locales.ts          # i18n support (zh-CN, en-US, ja-JP)
│       └── style.css           # Styles
├── config/                     # Webpack 5 build configuration
├── public/
│   ├── script.html             # Script service HTML entry
│   └── ui.html                 # Sidebar UI HTML entry
├── local_server/
│   ├── server.ts               # Local auth server for enterprise plugin development
│   └── .env.server             # DingTalk app credentials (AppKey, AppSecret, etc.)
├── manifest.json               # Plugin manifest (dev config)
├── package.json                # Dependencies (React 18, TypeScript, Webpack 5)
└── tsconfig.json               # TypeScript configuration
```

### Template Features

- **Complete CRUD Operations**: Sheet/Field/Record create, read, update, delete
- **Real-time Event Monitoring**: Selection changes, sheet/field/record insert/modify/delete events
- **i18n Support**: Chinese, English, Japanese with auto-detection
- **DingTalk Design Desktop UI**: Pre-integrated `dingtalk-design-desktop` component library
- **Enterprise Auth Support**: `configPermission` flow with local server for enterprise plugins
- **Hot Reload Development**: Webpack dev server with live reload

### How to Initialize a Project from Template

Guide users through these steps:

```bash
# 1. Copy the template to a new project directory
cp -r ./assets/addon-demo-main/ /path/to/my-plugin

# 2. Navigate to the project
cd /path/to/my-plugin

# 3. Install dependencies
pnpm install

# 4. Start development server
pnpm start
# App runs at http://localhost:3000

# 5. (Optional) For enterprise plugin auth, configure .env.server and start auth server
pnpm start:server
# Auth server runs at http://localhost:3001
```

### Debugging in AI Table

1. Open any AI Table document
2. Click "插件" (Plugins) to expand the plugin panel
3. Open "插件市场" (Plugin Market) → "自定义插件" (Custom Plugin) → "+新增插件" (Add Plugin)
4. Enter the two HTML URLs:
   - **Sidebar URL**: `http://localhost:3000/ui.html`
   - **Script Service URL**: `http://localhost:3000/script.html`
5. Click "确定" (Confirm) to load and run the plugin

### Key Files to Modify

When generating code for a new sidebar plugin based on this template:

| File | Purpose | What to Modify |
|------|---------|---------------|
| `src/script/service.ts` | Data operations | Add/modify `DingdocsScript.registerScript()` commands |
| `src/components/App.tsx` | UI interface | Replace with custom React components |
| `src/components/locales.ts` | i18n strings | Update translations for new UI text |
| `manifest.json` | Plugin config | Update name, URLs for production |

## Core Principles

1. **API Compliance**: Strictly follow AI Table API definitions in `./references/` and `../shared/references/api/` directory
2. **Dual-Page Architecture**: Separate Service page (Web Worker) for data operations and UI page (Sidebar iframe) for user interactions
3. **No Fabrication**: Never invent APIs or methods - only use documented interfaces
4. **Production Ready**: Include proper error handling, user feedback, event cleanup, and TypeScript type safety
5. **Event-Driven**: Support event listeners (button clicks, selection changes, record operations) with proper cleanup
6. **React-Based**: Use React for UI components with hooks and proper lifecycle management
7. **Permission Aware**: Check user permissions before performing operations

## Architecture Overview

Sidebar plugins use a dual-page architecture:

- **Service Page (service.ts)**: Runs in Web Worker, handles AI Table data model interactions via `DingdocsScript.base`
- **UI Page (ui.tsx)**: Runs in sidebar iframe, manages user interface with React components
- **Script Entry (script.tsx)**: Initializes the Service page using `initScript`

### Data Flow

```
User Action (ui.tsx)
    ↓
Dingdocs.script.run('commandName', params)
    ↓
Service Page (service.ts) - DingdocsScript.registerScript('commandName')
    ↓
AI Table API (DingdocsScript.base)
    ↓
Data Operations (CRUD, queries)
    ↓
Return Result to UI
    ↓
Update UI State
```

## Workflow

### Phase 1: Understand User Intent

Analyze user request to determine:
- **UI Components**: Data display, forms, buttons, selectors, tables, charts
- **Data Operations**: Read, create, update, delete records
- **Event Triggers**: Button clicks, selection changes, record modifications
- **User Interactions**: Form inputs, real-time updates, feedback messages
- **Complexity Level**: Simple display vs. complex business logic

**Ask clarifying questions if intent is ambiguous:**
- "What data should be displayed in the sidebar?"
- "Which sheet(s) should the plugin operate on?"
- "Should users be able to modify data from the UI?"
- "What events should trigger plugin actions?"
- "What visual elements are needed (forms, tables, charts)?"

### Phase 2: Consult API References

Before writing code, consult relevant API documentation:

**For Service Page (Data Operations):**
- `../shared/references/api/modules/Base 模块.md` - Base object methods
- `../shared/references/api/modules/Sheet 模块.md` - Sheet operations
- `../shared/references/api/modules/Field 模块.md` - Field operations
- `../shared/references/api/modules/Field api/` - Field type-specific APIs (TextField, NumberField, SingleSelectField, DateField, UserField, AttachmentField, etc.)
- `../shared/references/api/modules/Record 模块.md` - Record operations
- `../shared/references/api/modules/View 模块.md` - View operations
- `../shared/references/api/modules/GridView 表格视图.md` - GridView operations
- `../shared/references/api/modules/UI 模块.md` - UI operations (`toast`, `getSelection`, `setSelection`)

**For UI Page (Interactions):**
- `./references/AI表格边栏插件 开发指南.md` - Plugin development guide
- `./references/Event事件模块.md` - Event monitoring
- `./references/其他接口.md` - UI and helper APIs (`getLocale`, `getTheme`, `batchUploadFiles`, `configPermission`, `getAuthCode`)

**Important Note - Getting CorpId and User Info in Sidebar Plugins:**
> ⚠️ `Base.getCorpId()` 和 `Base.getCurrentUser()` 仅支持脚本插件，**不支持边栏插件**。
> 
> 如需在边栏插件中获取企业 ID 或当前用户信息，请参考 `./references/其他接口.md` 中的 `getAuthCode` API：
> 1. 从 URL 参数获取 `corpId`（配置 UI 地址时使用 `?corpId=$CORPID$`）
> 2. 调用 `Dingdocs.base.host.getAuthCode(corpId)` 获取免登码
> 3. 使用免登码调用钉钉开放平台接口获取用户信息

**For Type Definitions:**
- `../shared/references/api/interface/API 类型定义.md` - Type structures
- `../shared/references/api/interface/字段类型结构.md` - Field value types

**Critical Rule**: Never use undocumented APIs. If a method is not in the documentation, it does not exist.

### Phase 3: Generate Service Page (service.ts)

> **Important**: Service methods must return `ServiceResult<T>` instead of throwing errors.
> See **Phase 6** for the complete error handling guide.

#### Template Structure

```typescript
// 1. Define the unified result type
type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; errorCode: string };

// 2. Define data operation functions — return ServiceResult, never throw
async function getSheetInfo(): Promise<ServiceResult<{ name: string; recordCount: number }>> {
  const sheet = DingdocsScript.base.getActiveSheet();
  if (!sheet) {
    console.error('getSheetInfo: active sheet not found');
    return { success: false, errorCode: 'ACTIVE_SHEET_NOT_FOUND' };
  }
  
  const recordCount = (await sheet.getRecordsAsync({ pageSize: 1 })).total || 0;
  return {
    success: true,
    data: {
      name: sheet.getName(),
      recordCount: recordCount,
    },
  };
}

// 3. Register script commands
DingdocsScript.registerScript('getSheetInfo', getSheetInfo);
```

#### Common Service Patterns

**Pattern 1: Read Data**

> **⚠️ TypeScript 注意**: `getRecordsAsync` 返回的 `result.cursor` 类型为 `string | undefined`（最后一页时为 `undefined`）。
> 必须使用 `result.cursor ?? ''` 进行空值兜底，否则 TypeScript 严格模式会报 TS2322 错误。

```typescript
async function getRecords(sheetId: string) {
  const sheet = DingdocsScript.base.getSheet(sheetId);
  if (!sheet) {
    throw new Error('数据表不存在');
  }
  
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
  
  return allRecords.map(record => ({
    id: record.getId(),
    fields: record.getCellValues()
  }));
}

DingdocsScript.registerScript('getRecords', getRecords);
```

**Pattern 2: Batch Update**
```typescript
async function batchUpdateRecords(sheetId: string, updates: Array<{id: string, fields: any}>) {
  const sheet = DingdocsScript.base.getSheet(sheetId);
  if (!sheet) {
    throw new Error('数据表不存在');
  }
  
  const batchSize = 50;
  const results = [];
  
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    const updated = await sheet.updateRecordsAsync(batch);
    results.push(...updated);
  }
  
  return results;
}

DingdocsScript.registerScript('batchUpdateRecords', batchUpdateRecords);
```

**Pattern 3: Create Record**
```typescript
async function createRecord(sheetId: string, fields: any) {
  const sheet = DingdocsScript.base.getSheet(sheetId);
  if (!sheet) {
    throw new Error('数据表不存在');
  }
  
  const result = await sheet.insertRecordsAsync([{ fields }]);
  return result[0];
}

DingdocsScript.registerScript('createRecord', createRecord);
```

**Pattern 4: Delete Record**
```typescript
async function deleteRecord(sheetId: string, recordId: string) {
  const sheet = DingdocsScript.base.getSheet(sheetId);
  if (!sheet) {
    throw new Error('数据表不存在');
  }
  
  await sheet.deleteRecordsAsync(recordId);
  return { success: true };
}

DingdocsScript.registerScript('deleteRecord', deleteRecord);
```

### Phase 4: Generate Script Entry (script.tsx)

#### Template Structure

```typescript
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { initScript } from 'dingtalk-docs-cool-app';

function App() {
  useEffect(() => {
    initScript({
      scriptUrl: new URL(`${process.env.PUBLIC_URL}/static/js/script.code.js`, window.location.href),
      onError: (e) => {
        console.error('Script initialization error:', e);
      }
    });
  }, []);
  
  return null;
}

const root = ReactDOM.createRoot(document.getElementById('script')!);
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
```

### Phase 5: Generate UI Page (ui.tsx)

#### Template Structure

> **Important**: All user-facing strings must use i18n. See **Pattern 10** for the complete i18n guide.
> The template below uses `t()` function — you must also generate `locales.ts` with all 12 locales.

```typescript
import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { initView } from '@ali/we-addon-sandbox-init';
import translations, { TranslateKey } from './locales';

// ServiceResult type — must match service.ts definition
type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; errorCode: string };

// Error code → i18n key mapping
const ERROR_CODE_MAP: Record<string, TranslateKey> = {
  'ACTIVE_SHEET_NOT_FOUND': 'error_active_sheet_not_found',
  'SHEET_NOT_FOUND': 'error_sheet_not_found',
  // Add more mappings as needed
};

function App() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const localeRef = useRef<string>('zh-CN');

  const t = useCallback((key: TranslateKey): string => {
    const locale = localeRef.current as keyof typeof translations;
    return translations[locale]?.[key] || translations['zh-CN'][key] || translations['en-US']?.[key] || key;
  }, []);

  const resolveErrorCode = useCallback((errorCode: string, fallbackKey: TranslateKey): string => {
    const mappedKey = ERROR_CODE_MAP[errorCode];
    return mappedKey ? t(mappedKey) : t(fallbackKey);
  }, [t]);

  useEffect(() => {
    initView({
      onReady: async () => {
        const currentLocale = await Dingdocs.base.host.getLocale();
        localeRef.current = currentLocale;
        setInitialized(true);
        loadData();
      },
      onError: (e) => {
        console.error('UI initialization error:', e);
        setError(t('error_init_failed'));
      },
    });
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    const result: ServiceResult<any> = await Dingdocs.script.run('getSheetInfo');
    if (!result.success) {
      setError(resolveErrorCode(result.errorCode, 'error_load_failed'));
    } else {
      setData(result.data);
    }
    setLoading(false);
  };

  if (!initialized || loading) return <div>{t('loading')}</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{t('title')}</h1>
      <button onClick={loadData}>{t('refresh')}</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('ui')!);
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
```

#### Common UI Patterns

**Pattern 1: Event Listener with Cleanup**
```typescript
useEffect(() => {
  const handleButtonClick = (event: any) => {
    console.log('Button clicked:', event);
    // Handle button click
  };

  const off = Dingdocs.base.event.onButtonFieldClicked(handleButtonClick);

  return () => {
    off(); // Clean up event listener
  };
}, []);
```

**Pattern 2: Selection Change Listener**
```typescript
useEffect(() => {
  const handleSelectionChange = (selection: any) => {
    console.log('Selection changed:', selection);
    // Update UI based on selection
  };

  const off = Dingdocs.base.event.onSelectionChanged(handleSelectionChange);

  return () => {
    off(); // Clean up event listener
  };
}, []);
```

**Pattern 3: Form with State Management**
```typescript
const [formData, setFormData] = useState({
  name: '',
  description: ''
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = async () => {
  try {
    const result = await Dingdocs.script.run('createRecord', formData);
    console.log('Record created:', result);
    // Clear form or show success message
  } catch (err) {
    console.error('Create failed:', err);
  }
};

return (
  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="名称"
    />
    <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      placeholder="描述"
    />
    <button type="submit">提交</button>
  </form>
);
```

**Pattern 4: Data Table Display**
```typescript
const [records, setRecords] = useState<any[]>([]);

useEffect(() => {
  const loadRecords = async () => {
    try {
      const result = await Dingdocs.script.run('getRecords', sheetId);
      setRecords(result);
    } catch (err) {
      console.error('Load failed:', err);
    }
  };

  loadRecords();
}, [sheetId]);

return (
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>名称</th>
        <th>状态</th>
      </tr>
    </thead>
    <tbody>
      {records.map(record => (
        <tr key={record.id}>
          <td>{record.id}</td>
          <td>{record.fields['名称']}</td>
          <td>{record.fields['状态']}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
```

**Pattern 5: Real-time Updates**
```typescript
useEffect(() => {
  const handleRecordModified = (event: any) => {
    console.log('Record modified:', event);
    // Reload data or update UI
    loadData();
  };

  const off = Dingdocs.base.event.onRecordModified(handleRecordModified);

  return () => {
    off();
  };
}, []);

// Auto-refresh interval
useEffect(() => {
  const interval = setInterval(() => {
    loadData();
  }, 30000); // Refresh every 30 seconds

  return () => {
    clearInterval(interval);
  };
}, []);
```

### Phase 6: Error Handling and User Feedback

#### ⚠️ Critical: Service ↔ UI Communication Constraint

Service page (Web Worker) and UI page (sidebar iframe) communicate via **postMessage**. This means:

- **`throw Error` in service.ts CANNOT be caught by `try-catch` in App.tsx** — the error object is lost during serialization across iframe boundaries
- Service must return a structured result object instead of throwing errors
- UI must check the result object's `success` field instead of using try-catch

#### ServiceResult Pattern (Required)

Define a unified result type used by all service methods:

```typescript
// In service.ts — define the result type
type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; errorCode: string };
```

#### Service Page Error Handling

```typescript
// ✅ CORRECT: Return error as a result object
function getAllFields(): ServiceResult<FieldInfo[]> {
  const sheet = DingdocsScript.base.getActiveSheet();
  if (!sheet) {
    console.error('getAllFields: active sheet not found');
    return { success: false, errorCode: 'ACTIVE_SHEET_NOT_FOUND' };
  }

  const fields = sheet.getFields();
  return {
    success: true,
    data: fields.map((field) => ({
      id: field.getId(),
      name: field.getName(),
      type: field.getType(),
    })),
  };
}

// ❌ WRONG: throw Error — UI page cannot catch this
function getAllFieldsBad() {
  const sheet = DingdocsScript.base.getActiveSheet();
  if (!sheet) {
    throw new Error('未找到激活的数据表'); // UI will NOT receive this error
  }
  // ...
}

DingdocsScript.registerScript('getAllFields', getAllFields);
```

#### Standard Error Codes

Use consistent, uppercase, snake_case error codes across all service methods:

| Error Code | Meaning |
|---|---|
| `ACTIVE_SHEET_NOT_FOUND` | No active sheet selected |
| `SHEET_NOT_FOUND` | Sheet with given ID does not exist |
| `FIELD_NOT_FOUND` | Field with given ID does not exist |
| `RECORD_NOT_FOUND` | Record with given ID does not exist |
| `MISSING_PARAMS` | Required parameters are missing |
| `PERMISSION_DENIED` | User lacks required permissions |

#### TypeScript 类型安全注意事项

分页查询 `getRecordsAsync` 返回的 `result.cursor` 类型为 `string | undefined`，在最后一页时为 `undefined`。赋值给 `string` 类型变量时必须使用空值合并运算符兜底：

```typescript
// ✅ CORRECT: 使用 ?? 兜底
cursor = result.cursor ?? '';

// ❌ WRONG: TypeScript 严格模式下会报 TS2322
cursor = result.cursor;
```

#### ESLint 配置约束

模板项目的 ESLint 配置（`eslint-config-react-app`）**不包含** `eslint-plugin-react-hooks` 插件。因此：

```typescript
// ❌ WRONG: 使用未注册的 eslint 规则注释会导致编译错误
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// ✅ CORRECT: 正确补全 useEffect 的依赖数组，不使用 eslint-disable 注释
}, [loadData, addLog]);

// ✅ CORRECT: 对于初始化 useEffect（只需执行一次），使用空依赖数组即可，无需 eslint-disable 注释
useEffect(() => {
  initView({ onReady: async () => { /* ... */ } });
}, []);
```

**规则**：
1. 绝不使用 `// eslint-disable-next-line react-hooks/exhaustive-deps` 注释
2. 正确补全 `useEffect`、`useCallback`、`useMemo` 的依赖数组
3. 对于只需执行一次的初始化逻辑，直接使用空依赖数组 `[]`

#### UI Page Error Handling

```typescript
// In App.tsx — define the same ServiceResult type
type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; errorCode: string };

// Map error codes to i18n keys
const ERROR_CODE_MAP: Record<string, TranslateKey> = {
  'ACTIVE_SHEET_NOT_FOUND': 'error_active_sheet_not_found',
  'SHEET_NOT_FOUND': 'error_sheet_not_found',
  'FIELD_NOT_FOUND': 'error_field_not_found',
  'RECORD_NOT_FOUND': 'error_record_not_found',
};

// Resolve error code to localized message
const resolveErrorCode = useCallback((errorCode: string, fallbackKey: TranslateKey): string => {
  const mappedKey = ERROR_CODE_MAP[errorCode];
  return mappedKey ? t(mappedKey) : t(fallbackKey);
}, [t]);

// ✅ CORRECT: Check result.success instead of try-catch
const loadFields = useCallback(async () => {
  const result: ServiceResult<FieldInfo[]> = await Dingdocs.script.run('getAllFields');
  if (!result.success) {
    setError(resolveErrorCode(result.errorCode, 'error_load_fields_failed'));
    return;
  }
  setFields(result.data);
}, [resolveErrorCode]);

// ❌ WRONG: try-catch will NOT catch service errors
const loadFieldsBad = async () => {
  try {
    const fields = await Dingdocs.script.run('getAllFields');
    setFields(fields); // This will receive the ServiceResult object, not the data
  } catch (err) {
    setError('加载失败'); // This catch block will NEVER execute for service errors
  }
};
```

## Real-World Examples

Complete production-ready examples from the official plugin repository.

### Example 1: Button Trigger Plugin

**User Request**: "Create a plugin that listens to button field clicks and displays record data"

**Service Page (service.ts)**:
Reference: `./assets/examples/button-trigger-service.ts`

**UI Page (ui.tsx)**:
Reference: `./assets/examples/button-trigger-ui.tsx`

**Key Features**:
- Event listener for `onButtonFieldClicked`
- Displays record information when button is clicked
- Shows first 3 text fields of the record
- Includes timestamp of click event
- Proper cleanup of event listeners

### Example 2: Batch Field Modification Plugin

**User Request**: "Create a plugin to batch modify field types and hide/show fields in views"

**Service Page (service.ts)**:
Reference: `./assets/examples/batch-modify-service.ts`

**Key Features**:
- Batch modify field types with validation
- Batch hide/show fields in grid views
- Prevents hiding primary fields
- Detailed error reporting with field-level failures
- Returns comprehensive result information

### Example 3: CSV Import Plugin

**User Request**: "Create a plugin to import CSV data into AI Table"

**Key Features** (from plugin/examples/csv-import):
- CSV parsing with configurable delimiters
- Automatic field type inference
- Support for creating new sheets or appending to existing sheets
- Field mapping for append mode
- Batch import with progress tracking
- Error handling with ignore option
- Support for various field types (text, number, date, select, url, etc.)

### Example 4: Download Attachment Plugin

**Key Features** (from plugin/examples/download-attachment):
- Batch download attachments from records
- Progress tracking for large files
- Error handling for failed downloads
- Organizes downloaded files by record

### Example 5: Remove Duplicate Records Plugin

**Key Features** (from plugin/examples/remove-dup-records):
- Identifies duplicate records based on selected fields
- Provides preview before deletion
- Batch delete with confirmation
- Preserves original records when duplicates removed

### Example 6: Merge Tables Plugin

**Key Features** (from plugin/examples/merge-table):
- Combines data from multiple sheets
- Field mapping between sheets
- Conflict resolution strategies
- Preview of merge results

## Advanced UI Patterns

### Pattern 6: Form with Validation

```typescript
const [formData, setFormData] = useState({
  sheetId: '',
  fieldName: '',
  value: ''
});
const [errors, setErrors] = useState<Record<string, string>>({});

const validateForm = () => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.sheetId) {
    newErrors.sheetId = '请选择数据表';
  }
  
  if (!formData.fieldName) {
    newErrors.fieldName = '请选择字段';
  }
  
  if (!formData.value) {
    newErrors.value = '请输入值';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  
  try {
    const result = await Dingdocs.script.run('updateField', formData);
    console.log('Update successful:', result);
    // Show success message
  } catch (err) {
    console.error('Update failed:', err);
    // Show error message
  }
};

return (
  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <div>
      <label>数据表:</label>
      <select 
        value={formData.sheetId}
        onChange={(e) => setFormData({...formData, sheetId: e.target.value})}
      >
        <option value="">请选择</option>
        {sheets.map(sheet => (
          <option key={sheet.id} value={sheet.id}>{sheet.name}</option>
        ))}
      </select>
      {errors.sheetId && <div className="error">{errors.sheetId}</div>}
    </div>
    
    <div>
      <label>字段:</label>
      <select 
        value={formData.fieldName}
        onChange={(e) => setFormData({...formData, fieldName: e.target.value})}
      >
        <option value="">请选择</option>
        {fields.map(field => (
          <option key={field.id} value={field.id}>{field.name}</option>
        ))}
      </select>
      {errors.fieldName && <div className="error">{errors.fieldName}</div>}
    </div>
    
    <div>
      <label>值:</label>
      <input
        type="text"
        value={formData.value}
        onChange={(e) => setFormData({...formData, value: e.target.value})}
      />
      {errors.value && <div className="error">{errors.value}</div>}
    </div>
    
    <button type="submit">提交</button>
  </form>
);
```

### Pattern 7: Real-time Data Table with Selection

```typescript
const [records, setRecords] = useState<any[]>([]);
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
const [loading, setLoading] = useState(false);

const loadRecords = async () => {
  setLoading(true);
  try {
    const result = await Dingdocs.script.run('getRecords', { sheetId });
    setRecords(result);
  } catch (err) {
    console.error('Load failed:', err);
  } finally {
    setLoading(false);
  }
};

const toggleSelection = (id: string) => {
  const newSelection = new Set(selectedIds);
  if (newSelection.has(id)) {
    newSelection.delete(id);
  } else {
    newSelection.add(id);
  }
  setSelectedIds(newSelection);
};

const batchDeleteSelected = async () => {
  if (selectedIds.size === 0) return;
  
  try {
    const result = await Dingdocs.script.run('batchDeleteRecords', {
      sheetId,
      recordIds: Array.from(selectedIds)
    });
    console.log('Delete successful:', result);
    loadRecords(); // Reload after deletion
    setSelectedIds(new Set());
  } catch (err) {
    console.error('Delete failed:', err);
  }
};

return (
  <div>
    <button onClick={loadRecords} disabled={loading}>
      {loading ? '加载中...' : '刷新'}
    </button>
    
    {selectedIds.size > 0 && (
      <button onClick={batchDeleteSelected}>
        删除选中 ({selectedIds.size})
      </button>
    )}
    
    <table>
      <thead>
        <tr>
          <th><input 
            type="checkbox" 
            checked={records.length > 0 && selectedIds.size === records.length}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedIds(new Set(records.map(r => r.id)));
              } else {
                setSelectedIds(new Set());
              }
            }}
          /></th>
          <th>ID</th>
          <th>名称</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        {records.map(record => (
          <tr key={record.id}>
            <td>
              <input 
                type="checkbox"
                checked={selectedIds.has(record.id)}
                onChange={() => toggleSelection(record.id)}
              />
            </td>
            <td>{record.id}</td>
            <td>{record.fields['名称']}</td>
            <td>{record.fields['状态']}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
```

### Pattern 8: Progress Indicator for Long Operations

```typescript
const [progress, setProgress] = useState<{ current: number; total: number; message: string }>({
  current: 0,
  total: 0,
  message: ''
});
const [processing, setProcessing] = useState(false);

const processBatch = async (items: any[]) => {
  setProcessing(true);
  setProgress({ current: 0, total: items.length, message: '开始处理...' });
  
  const batchSize = 50;
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    try {
      const result = await Dingdocs.script.run('processBatch', batch);
      results.push(...result);
      setProgress({
        current: results.length,
        total: items.length,
        message: `正在处理 ${results.length}/${items.length}...`
      });
    } catch (err) {
      console.error(`Batch ${i}-${i + batchSize} failed:`, err);
    }
  }
  
  setProgress({
    current: results.length,
    total: items.length,
    message: '处理完成'
  });
  setProcessing(false);
  
  return results;
};

return (
  <div>
    {processing && (
      <div>
        <div>进度: {progress.current} / {progress.total}</div>
        <div>{progress.message}</div>
        <div style={{ width: '100%', height: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <div 
            style={{ 
              width: `${(progress.current / progress.total) * 100}%`, 
              height: '100%', 
              backgroundColor: '#1890ff',
              borderRadius: '5px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
    )}
  </div>
);
```

### Pattern 9: Responsive Layout with Tabs

```typescript
const [activeTab, setActiveTab] = useState<'data' | 'settings' | 'help'>('data');

return (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', borderBottom: '1px solid #d9d9d9' }}>
      <button
        onClick={() => setActiveTab('data')}
        style={{
          padding: '12px 20px',
          border: 'none',
          borderBottom: activeTab === 'data' ? '2px solid #1890ff' : 'none',
          backgroundColor: activeTab === 'data' ? '#fff' : 'transparent',
          cursor: 'pointer'
        }}
      >
        数据
      </button>
      <button
        onClick={() => setActiveTab('settings')}
        style={{
          padding: '12px 20px',
          border: 'none',
          borderBottom: activeTab === 'settings' ? '2px solid #1890ff' : 'none',
          backgroundColor: activeTab === 'settings' ? '#fff' : 'transparent',
          cursor: 'pointer'
        }}
      >
        设置
      </button>
      <button
        onClick={() => setActiveTab('help')}
        style={{
          padding: '12px 20px',
          border: 'none',
          borderBottom: activeTab === 'help' ? '2px solid #1890ff' : 'none',
          backgroundColor: activeTab === 'help' ? '#fff' : 'transparent',
          cursor: 'pointer'
        }}
      >
        帮助
      </button>
    </div>
    
    <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
      {activeTab === 'data' && <DataView />}
      {activeTab === 'settings' && <SettingsView />}
      {activeTab === 'help' && <HelpView />}
    </div>
  </div>
);
```

### Pattern 10: Internationalization (i18n) — Complete Guide

AI Table sidebar plugins must support **12 languages**. This section covers the complete i18n architecture, best practices, and common pitfalls.

#### Supported Languages (Required)

All plugins must provide translations for these 12 locales:

| Locale Code | Language |
|---|---|
| `zh-CN` | Simplified Chinese (default) |
| `zh-HK` | Traditional Chinese (Hong Kong) |
| `zh-TW` | Traditional Chinese (Taiwan) |
| `ja-JP` | Japanese |
| `en-US` | English |
| `ko-KR` | Korean |
| `pt-BR` | Portuguese (Brazil) |
| `tr-TR` | Turkish |
| `th-TH` | Thai |
| `id-ID` | Indonesian |
| `ms-MY` | Malay |
| `es-LA` | Spanish (Latin America) |

#### Step 1: Create `locales.ts`

```typescript
// src/components/locales.ts
import { Locale } from '@ali/we-addon-sandbox-init';

// 1. Define all translation keys with TypeScript type safety
export type TranslateType = {
  'title': string;
  'loading': string;
  'submit': string;
  'success_message': string;
  // Error messages — must cover all service error codes
  'error_active_sheet_not_found': string;
  'error_sheet_not_found': string;
  'error_field_not_found': string;
  'error_record_not_found': string;
  'error_load_failed': string;
  'error_init_failed': string;
};

export type TranslateKey = keyof TranslateType;

// 2. Provide translations for ALL 12 locales
const translations: Record<Locale, TranslateType> = {
  'zh-CN': {
    'title': '插件标题',
    'loading': '加载中…',
    'submit': '提交',
    'success_message': '操作成功',
    'error_active_sheet_not_found': '未找到当前数据表，请先打开一个数据表',
    'error_sheet_not_found': '数据表不存在，请重新选择',
    'error_field_not_found': '字段不存在，请重新选择',
    'error_record_not_found': '记录不存在，请选择其他行',
    'error_load_failed': '加载数据失败',
    'error_init_failed': '插件初始化失败，请刷新重试',
  },
  'zh-HK': {
    'title': '插件標題',
    'loading': '加載中…',
    // ... all keys for zh-HK
  },
  'zh-TW': {
    'title': '外掛標題',
    'loading': '載入中…',
    // ... all keys for zh-TW
  },
  'ja-JP': {
    'title': 'プラグインタイトル',
    'loading': '読み込み中…',
    // ... all keys for ja-JP
  },
  'en-US': {
    'title': 'Plugin Title',
    'loading': 'Loading…',
    'submit': 'Submit',
    'success_message': 'Operation successful',
    'error_active_sheet_not_found': 'No active table found. Please open a table first',
    'error_sheet_not_found': 'Table not found. Please reselect',
    'error_field_not_found': 'Field not found. Please reselect',
    'error_record_not_found': 'Record not found. Please select another row',
    'error_load_failed': 'Failed to load data',
    'error_init_failed': 'Plugin initialization failed. Please refresh and try again',
  },
  'ko-KR': { /* ... */ },
  'pt-BR': { /* ... */ },
  'tr-TR': { /* ... */ },
  'th-TH': { /* ... */ },
  'id-ID': { /* ... */ },
  'ms-MY': { /* ... */ },
  'es-LA': { /* ... */ },
};

export default translations;
```

#### Step 2: Initialize i18n in App.tsx

```typescript
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { initView } from '@ali/we-addon-sandbox-init';
import translations, { TranslateKey } from './locales';

function App() {
  const [initialized, setInitialized] = useState(false);

  // Use useRef for locale to avoid re-renders and stale closures in callbacks
  const localeRef = useRef<string>('zh-CN');

  // Translation function with fallback chain: current locale → zh-CN → en-US → raw key
  const t = useCallback((key: TranslateKey): string => {
    const locale = localeRef.current as keyof typeof translations;
    return translations[locale]?.[key]
      || translations['zh-CN'][key]
      || translations['en-US']?.[key]
      || key;
  }, []);

  useEffect(() => {
    initView({
      onReady: async () => {
        // Get current locale from AI Table host
        const currentLocale = await Dingdocs.base.host.getLocale();
        localeRef.current = currentLocale;
        setInitialized(true);
      },
      onError: (e) => {
        console.error('UI initialization error:', e);
      },
    });
  }, []);

  if (!initialized) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div>
      <h1>{t('title')}</h1>
      <button onClick={handleSubmit}>{t('submit')}</button>
    </div>
  );
}
```

#### Key Design Decisions

**Why `useRef` for locale instead of `useState`?**

```typescript
// ✅ CORRECT: useRef — callbacks always read the latest locale
const localeRef = useRef<string>('zh-CN');
const t = useCallback((key: TranslateKey): string => {
  const locale = localeRef.current; // Always current value
  return translations[locale]?.[key] || key;
}, []); // No dependency on locale — stable reference

// ❌ PROBLEMATIC: useState — callbacks may capture stale locale
const [locale, setLocale] = useState('zh-CN');
const t = useCallback((key: TranslateKey): string => {
  return translations[locale]?.[key] || key; // May be stale in event handlers
}, [locale]); // Re-creates on every locale change, breaking memoization
```

**Why a 3-level fallback chain?**

```typescript
// Fallback: current locale → zh-CN → en-US → raw key
// This ensures:
// 1. If a translation is missing for the current locale, zh-CN (default) is used
// 2. If zh-CN is also missing (shouldn't happen), en-US provides a readable fallback
// 3. If all translations are missing, the raw key is shown (useful for debugging)
```

#### ⚠️ Common Pitfalls

**Pitfall 1: Hardcoding Chinese strings in JSX**
```typescript
// ❌ WRONG
<button>提交</button>
<div>加载中...</div>

// ✅ CORRECT
<button>{t('submit')}</button>
<div>{t('loading')}</div>
```

**Pitfall 2: Hardcoding error messages in service.ts**
```typescript
// ❌ WRONG — service runs in Web Worker, no access to i18n
throw new Error('数据表不存在');
return { success: false, error: '数据表不存在' };

// ✅ CORRECT — return error code, let UI translate
return { success: false, errorCode: 'SHEET_NOT_FOUND' };
```

**Pitfall 3: Using try-catch for service errors**
```typescript
// ❌ WRONG — postMessage cannot transmit Error objects
try {
  const data = await Dingdocs.script.run('getData');
} catch (err) {
  // This catch block will NEVER execute for service-side errors
  setError(err.message);
}

// ✅ CORRECT — check ServiceResult
const result: ServiceResult<Data> = await Dingdocs.script.run('getData');
if (!result.success) {
  setError(resolveErrorCode(result.errorCode, 'error_load_failed'));
  return;
}
setData(result.data);
```

**Pitfall 4: Forgetting to translate error messages**
```typescript
// ❌ WRONG — error messages are also user-facing text
setError('加载字段列表失败');

// ✅ CORRECT — error messages need i18n too
setError(t('error_load_failed'));
// Or with error code mapping:
setError(resolveErrorCode(result.errorCode, 'error_load_failed'));
```

**Pitfall 5: Missing locales**
```typescript
// ❌ WRONG — only providing zh-CN and en-US
const translations = {
  'zh-CN': { ... },
  'en-US': { ... },
};

// ✅ CORRECT — must provide all 12 locales
// Use Record<Locale, TranslateType> to get compile-time checking
const translations: Record<Locale, TranslateType> = {
  'zh-CN': { ... },
  'zh-HK': { ... },
  'zh-TW': { ... },
  'ja-JP': { ... },
  'en-US': { ... },
  'ko-KR': { ... },
  'pt-BR': { ... },
  'tr-TR': { ... },
  'th-TH': { ... },
  'id-ID': { ... },
  'ms-MY': { ... },
  'es-LA': { ... },
};
```

**Pitfall 6: Dynamic string concatenation instead of template keys**
```typescript
// ❌ WRONG — breaks translation
setMessage('正在处理 ' + count + '/' + total + '...');

// ✅ CORRECT — use a template key with parameters
// In locales.ts: 'processing_progress': '正在处理 {{current}}/{{total}}…'
setMessage(t('processing_progress').replace('{{current}}', String(count)).replace('{{total}}', String(total)));
```

#### i18n Checklist

Before delivering generated code, verify:
- [ ] `locales.ts` defines `TranslateType` with all UI text keys
- [ ] `locales.ts` provides translations for all 12 locales via `Record<Locale, TranslateType>`
- [ ] `Locale` type is imported from `@ali/we-addon-sandbox-init`
- [ ] App.tsx uses `localeRef` (useRef) + `t()` function pattern
- [ ] Locale is fetched in `initView.onReady` via `Dingdocs.base.host.getLocale()`
- [ ] `t()` has 3-level fallback: current locale → zh-CN → en-US → raw key
- [ ] No hardcoded Chinese strings in JSX or error messages
- [ ] All service methods return `ServiceResult<T>` instead of throwing errors
- [ ] Error codes are mapped to i18n keys via `ERROR_CODE_MAP`
- [ ] Error messages in locales.ts cover all service error codes (prefixed with `error_`)

## Working with Examples

The Skill provides real-world examples in the `./assets/examples/` directory. These examples are from the official plugin repository and demonstrate production-ready patterns.

### Available Examples

1. **button-trigger-service.ts / button-trigger-ui.tsx** - Event listener for button field clicks
2. **batch-modify-service.ts** - Batch field type modification and view control
3. **csv-import** (from plugin/examples) - CSV data import with field type inference
4. **download-attachment** (from plugin/examples) - Batch attachment download
5. **remove-dup-records** (from plugin/examples) - Duplicate record detection and removal
6. **merge-table** (from plugin/examples) - Merge multiple sheets

### How to Use Examples

**For Reference:**
```typescript
// Reference the example code to understand patterns
// Example: ./assets/examples/button-trigger-service.ts
```

**For Learning:**
- Study the service page to understand data operations
- Study the UI page to understand React patterns
- Examine error handling and user feedback
- Learn event listener cleanup patterns

**For Adaptation:**
- Copy relevant code sections to your project
- Modify to fit your specific requirements
- Adapt the patterns to your use case
- Maintain the same structure and best practices

### Example-Based Learning Path

**Beginner:** Start with `button-trigger` to understand:
- Basic dual-page architecture
- Event listener setup and cleanup
- Simple data fetching
- State management in React

**Intermediate:** Study `batch-modify` to learn:
- Complex data operations
- Batch processing patterns
- Error handling with detailed feedback
- Field and view manipulation

**Advanced:** Explore `csv-import` to master:
- Data parsing and validation
- Field type inference
- Complex data transformation
- Large-scale data handling
- Progress tracking

## Common Operations Reference

### Service Page APIs

**Base API**:
```typescript
const base = DingdocsScript.base;
const sheet = base.getActiveSheet();
const sheets = base.getSheets();
```

**Sheet API**:
```typescript
const fields = sheet.getFields();
const field = sheet.getField('fieldName');
const records = await sheet.getRecordsAsync({ pageSize: 100 });
await sheet.insertRecordsAsync([{ fields: { 'field': 'value' } }]);
await sheet.updateRecordsAsync([{ id: 'recId', fields: { 'field': 'newValue' } }]);
await sheet.deleteRecordsAsync(['recId1', 'recId2']);
```

**Field API**:
```typescript
if (DingdocsScript.base.isFieldOfType(field, 'number')) {
  const value = await field.getValueAsync(recordId);
  await field.setValueAsync(recordId, newValue);
}
```

### UI Page APIs

**Initialization**:
```typescript
initView({
  onReady: () => { /* Ready */ },
  onError: (e) => { /* Error */ },
});
```

**Script Execution**:
```typescript
const result = await Dingdocs.script.run('commandName', params);
```

**Event Listeners**:
```typescript
// Button click
const off = Dingdocs.base.event.onButtonFieldClicked((event) => {
  console.log('Button clicked:', event);
});

// Selection change
const off2 = Dingdocs.base.event.onSelectionChanged((selection) => {
  console.log('Selection changed:', selection);
});

// Record operations
const off3 = Dingdocs.base.event.onRecordInserted((event) => {
  console.log('Record inserted:', event);
});

// Cleanup
return () => {
  off();
  off2();
  off3();
};
```

**UI Helper**:
```typescript
// Toast messages (if available)
await Dingdocs.base.host.configPermission(...); // For authentication
```

## Troubleshooting

### Common Errors

**Error: "Script service unregistered"**
- Cause: Using incorrect script command name or service not initialized
- Solution: Ensure command name matches between `registerScript` and `script.run`

**Error: "Event listener not working"**
- Cause: Event listener not properly registered or cleaned up
- Solution: Use `useEffect` with cleanup function, verify event name is correct

**Error: "Permission denied"**
- Cause: User doesn't have required permissions
- Solution: Check permissions using `base.getPermissionAsync()` or display error message

**Error: "React component not rendering"**
- Cause: Missing or incorrect DOM element
- Solution: Ensure `document.getElementById('ui')` exists

**Error: "Type mismatch"**
- Cause: Incorrect TypeScript types
- Solution: Use proper type definitions from `../shared/references/api/interface/`

### Validation Checklist

Before delivering generated code:
- [ ] All API calls match documentation exactly
- [ ] Service page uses `DingdocsScript.registerScript` for all commands
- [ ] Service methods return `ServiceResult<T>` — never `throw Error`
- [ ] UI page uses `Dingdocs.script.run` to call service commands
- [ ] UI checks `result.success` — never uses `try-catch` for service errors
- [ ] Event listeners are properly registered and cleaned up
- [ ] TypeScript types are correct
- [ ] React hooks are used properly (no side effects in render)
- [ ] No memory leaks (cleanup functions in useEffect)
- [ ] User feedback for loading and error states
- [ ] No invented or undocumented APIs
- [ ] `locales.ts` provides translations for all 12 locales
- [ ] No hardcoded Chinese strings in JSX — all use `t()` function
- [ ] Error codes mapped to i18n keys via `ERROR_CODE_MAP`
- [ ] `Locale` type imported from `@ali/we-addon-sandbox-init`

## Best Practices

1. **Separate Concerns**: Keep data operations in service.ts, UI logic in ui.tsx
2. **Type Safety**: Use TypeScript types from API documentation
3. **ServiceResult Pattern**: Service methods return `ServiceResult<T>` instead of throwing errors (see Phase 6)
4. **Internationalization**: All user-facing text must use i18n with 12 locales (see Pattern 10)
5. **Error Code Mapping**: Service returns error codes, UI maps them to localized messages via `ERROR_CODE_MAP`
6. **Loading States**: Show loading indicators during async operations
7. **Event Cleanup**: Always clean up event listeners in useEffect cleanup
8. **Permission Checks**: Verify user has required permissions before operations
9. **Batch Operations**: Process records in batches for large datasets
10. **User Feedback**: Provide clear, localized feedback for all user actions
11. **Code Organization**: Keep components focused and reusable
12. **Performance**: Use React.memo, useMemo, useCallback for optimization
13. **Security**: Never expose sensitive data or credentials
14. **Testing**: Test edge cases (empty data, errors, null values)
15. **Accessibility**: Ensure UI is accessible (aria labels, keyboard navigation)
16. **Responsive Design**: Make UI work on different screen sizes
17. **No Hardcoded Strings**: Never hardcode Chinese or any language strings in JSX — always use `t()` function

## Publishing Guidance

When users mention publishing, provide guidance from:
- `./references/AI 表格插件 - 企业内插件发布指南.md` - Enterprise plugin publishing
- `./references/ISV接入AI表格开放API.md` - ISV integration
- `./references/其他接口.md` - Authentication and configuration

Key points:
- Configure plugin authentication with `Dingdocs.base.host.configPermission`
- Set up cool app in DingTalk developer console
- Configure user interface address and service address
- Test plugin before publishing
- Get corpId from URL parameters for multi-organization support