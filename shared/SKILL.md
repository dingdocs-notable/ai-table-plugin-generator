---
name: shared
description: Shared API references for AI Table (钉钉表格) script and plugin development. Contains comprehensive documentation for Base, Sheet, Field, Record, View, Input, Output, and UI modules. This skill serves as a common knowledge base for other AI Table related skills.
license: MIT
metadata:
  author: AI Table Team
  version: 1.0.0
  category: reference
  tags: [ai-table, api-reference, shared, documentation]
---

# AI Table Shared API References

Centralized API documentation for AI Table (钉钉表格) development. This module is referenced by both `ai-script-generator` and `ai-sidebar-plugin-generator` to ensure consistent, accurate API usage.

## Instructions

### Step 1: Identify the Operation Type

Determine which API module to consult based on the operation:

| Operation | Module | Document |
|-----------|--------|----------|
| Access sheets, global operations | Base | `references/api/modules/Base 模块.md` |
| Sheet CRUD, field/record management | Sheet | `references/api/modules/Sheet 模块.md` |
| Field operations, type checking | Field | `references/api/modules/Field 模块.md` |
| Record read/write | Record | `references/api/modules/Record 模块.md` |
| View operations | View | `references/api/modules/View 模块.md` |
| Grid view specific | GridView | `references/api/modules/GridView 表格视图.md` |
| User input (Script only) | Input | `references/api/modules/Input模块.md` |
| Logging (Script only) | Output | `references/api/modules/Output模块.md` |
| Toast notifications | UI | `references/api/modules/UI 模块.md` |

### Step 2: Check Field-Specific APIs

For field type operations, consult the specific field document in `references/api/modules/Field api/`:

| Field Type | Document |
|-----------|----------|
| Text | `TextField 文本字段.md` |
| Number | `NumberField 数字字段.md` |
| Date | `DateField 日期字段.md` |
| Single Select | `SingleSelectField 单选字段.md` |
| Multi Select | `MultiSelectField 多选字段.md` |
| Attachment | `AttachmentField 附件字段.md` |
| User | `UserField 人员字段.md` |
| Currency | `CurrencyField 货币字段.md` |
| Rating | `RatingField 评分字段.md` |
| Progress | `ProgressField 进度字段.md` |
| URL | `UrlField 链接字段.md` |
| Email | `EmailField 邮箱字段.md` |
| Checkbox | `CheckboxField 复选框字段.md` |
| Bidirectional Link | `BidirectionalLinkField 双向关联字段.md` |
| Unidirectional Link | `UnidirectionalLinkFields 单向关联字段.md` |
| Lookup | `LookupField 关联引用字段.md` |
| FilterUp | `FilterUpField 查找引用字段.md` |
| Formula | `FormulaField 公式字段.md` |
| Created Time | `CreatedTimeField 创建时间字段.md` |
| Last Modified Time | `LastModifiedTimeField 最后更新时间字段.md` |
| Primary | `PrimaryField 主键文档字段.md` |
| Rich Text | `RichTextField 富文本字段.md` |
| Telephone | `TelephoneField 电话字段.md` |
| Barcode | `BarcodeField 条码字段.md` |
| GeoLocation | `GeoLocationField 地理位置字段.md` |
| Department | `DepartmentField 部门字段.md` |
| Group | `GroupField 群组字段.md` |

### Step 3: Check Type Definitions

For value structures and type definitions:
- `references/api/interface/API 类型定义.md` — API type definitions
- `references/api/interface/字段类型结构.md` — Field value structures (read/write formats)
- `references/api/读写AI 表格模型.md` — Data model overview

## Module Quick Reference

### Base Module
```typescript
const sheets = Base.getSheets();              // Get all sheets
const sheet = Base.getActiveSheet();           // Get active sheet
const sheet = Base.getSheet('sheetId');        // Get sheet by ID
Base.isFieldOfType(field, 'number');           // Type-safe field check
Base.ui.toast({ type: 'success', message: 'Done' }); // Toast notification
```

### Sheet Module
```typescript
const fields = sheet.getFields();                          // Get all fields
const field = sheet.getField('fieldNameOrId');              // Get field
const newField = sheet.insertField('name', 'text');        // Add field (separate params!)
sheet.deleteField('fieldId');                               // Delete field
const result = await sheet.getRecordsAsync({ pageSize: 100, cursor: '' }); // Paginated read
await sheet.insertRecordsAsync([{ fields: { '字段名': '值' } }]);          // Insert (max 500)
await sheet.updateRecordsAsync([{ id: 'recId', fields: { '字段名': '新值' } }]); // Update (max 100)
await sheet.deleteRecordsAsync(['recId1', 'recId2']);       // Delete records
```

### Field Module
```typescript
field.getName();                    // Get field name
field.getType();                    // Get field type string
field.getId();                      // Get field ID
field.isPrimary();                  // Check if primary field
await field.getValueAsync(recordId);    // Get cell value
await field.setValueAsync(recordId, value); // Set cell value
// Select fields only:
field.getOptions();                 // Get select options
```

### Record Module
```typescript
record.getId();                     // Get record ID
record.getCellValue('fieldNameOrId'); // Get single cell value
record.getCellValues();             // Get all cell values as object
```

### Input Module (Script Only)
```typescript
const text = await Input.textAsync('提示文本');
const choice = await Input.selectAsync('请选择', ['A', 'B', 'C']);
const form = await Input.formAsync('配置', [
  { type: 'sheet', key: 'sheet', option: { label: '数据表' }, required: true },
  { type: 'field', key: 'field', option: { label: '字段', referenceSheet: 'sheet' }, required: true },
  { type: 'record', key: 'record', option: { label: '记录', referenceSheet: 'sheet' }, required: true },
  { type: 'text', key: 'name', option: { label: '名称' }, required: true },
  { type: 'number', key: 'count', option: { label: '数量' }, required: true },
  { type: 'select', key: 'mode', option: { label: '模式', options: ['A', 'B'] }, required: true }
]);
```

### Output Module (Script Only)
```typescript
Output.log('普通日志');
Output.info('提示信息');
Output.warn('警告信息');
Output.error('错误信息');
Output.markdown('# Markdown text');
Output.table([{ name: 'John', age: 30 }]);
```

## Critical Rules

1. **Never invent APIs**: Only use methods documented in `references/api/`. If a method is not documented, it does not exist.
2. **Correct method names**: Use `insertRecordsAsync` (not `addRecordsAsync`), `insertField` (not `addFieldAsync`)
3. **insertField parameters**: Use `sheet.insertField('name', 'type')` with separate string params, NOT `insertField({ name, type })`
4. **Type safety**: Always use `Base.isFieldOfType(field, 'typeName')` before type-specific operations
5. **Pagination**: Use cursor-based pagination for `getRecordsAsync` — never assume all records fit in one call
6. **Batch limits**: Insert max 500 records/call, Update max 100 records/call
7. **Error handling**: All async operations must be wrapped in try-catch
8. **FormItem vs Field types**: `Input.formAsync` uses FormItem types (`sheet`, `field`, `view`, `record`, `text`, `number`, `select`), which are different from field types (`text`, `number`, `date`, `singleSelect`, etc.)

## Directory Structure

```
shared/
├── SKILL.md                              # This file
└── references/
    └── api/
        ├── 读写AI 表格模型.md              # Data model overview
        ├── interface/
        │   ├── API 类型定义.md             # API type definitions
        │   └── 字段类型结构.md             # Field value structures
        └── modules/
            ├── Base 模块.md                # Base module
            ├── Sheet 模块.md               # Sheet operations
            ├── Field 模块.md               # Field operations
            ├── Record 模块.md              # Record operations
            ├── View 模块.md                # View operations
            ├── GridView 表格视图.md        # Grid view API
            ├── Input模块.md                # User input (Script)
            ├── Output模块.md               # Logging (Script)
            ├── UI 模块.md                  # UI components
            └── Field api/                  # 26 field type APIs
                ├── TextField 文本字段.md
                ├── NumberField 数字字段.md
                ├── DateField 日期字段.md
                ├── SingleSelectField 单选字段.md
                ├── MultiSelectField 多选字段.md
                ├── AttachmentField 附件字段.md
                ├── UserField 人员字段.md
                ├── CurrencyField 货币字段.md
                ├── RatingField 评分字段.md
                ├── ProgressField 进度字段.md
                ├── UrlField 链接字段.md
                ├── EmailField 邮箱字段.md
                ├── CheckboxField 复选框字段.md
                ├── BidirectionalLinkField 双向关联字段.md
                ├── UnidirectionalLinkFields 单向关联字段.md
                ├── LookupField 关联引用字段.md
                ├── FilterUpField 查找引用字段.md
                ├── FormulaField 公式字段.md
                ├── CreatedTimeField 创建时间字段.md
                ├── LastModifiedTimeField 最后更新时间字段.md
                ├── PrimaryField 主键文档字段.md
                ├── RichTextField 富文本字段.md
                ├── TelephoneField 电话字段.md
                ├── BarcodeField 条码字段.md
                ├── GeoLocationField 地理位置字段.md
                ├── DepartmentField 部门字段.md
                └── GroupField 群组字段.md
```

## How Other Skills Reference This Module

```markdown
# In ai-script-generator/SKILL.md or ai-sidebar-plugin-generator/SKILL.md:
- Base operations: `../shared/references/api/modules/Base 模块.md`
- Sheet operations: `../shared/references/api/modules/Sheet 模块.md`
- Field operations: `../shared/references/api/modules/Field 模块.md`
- Type definitions: `../shared/references/api/interface/API 类型定义.md`
```
