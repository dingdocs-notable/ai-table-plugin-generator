# AI Table API Quick Reference

## Quick Lookup

### Global Objects
- `Base` - AI表格顶级对象
- `Input` - 用户输入交互
- `Output` - 输出显示

### Sheet Operations
```typescript
Base.getActiveSheet()              // 获取当前激活的数据表
Base.getSheet(idOrName)            // 根据ID或名称获取数据表
Base.getSheets()                   // 获取所有数据表
```

### Field Operations
```typescript
sheet.getField(idOrName)           // 获取字段
sheet.getFields()                  // 获取所有字段
sheet.insertField(name, type, property)  // 插入字段
Base.isFieldOfType(field, type)    // 检查字段类型
```

### Record Operations
```typescript
sheet.getRecordsAsync(options)     // 获取记录
sheet.insertRecordsAsync(records)  // 插入记录
sheet.updateRecordsAsync(records)  // 更新记录
sheet.deleteRecordsAsync(ids)      // 删除记录
```

### Field Type-Specific Methods

#### Text Field
```typescript
await textField.getValueAsync(recordId)  // Promise<string | null>
await textField.setValueAsync(recordId, text: string)  // Promise<boolean>
```

#### Number Field
```typescript
await numberField.getValueAsync(recordId)  // Promise<number | null>
await numberField.setValueAsync(recordId, num: number | string)  // Promise<boolean>
```

#### Date Field
```typescript
await dateField.getValueAsync(recordId)  // Promise<number | null> (timestamp)
await dateField.setValueAsync(recordId, timestamp: number | string)  // Promise<boolean>
```

#### Single Select Field
```typescript
await singleSelectField.getValueAsync(recordId)  // Promise<{id, name} | null>
await singleSelectField.setValueAsync(recordId, optionId: string)  // Promise<boolean>
singleSelectField.getOptions()  // Array<{id, name, color}>
singleSelectField.addOption(name)  // string
```

#### Multiple Select Field
```typescript
await multiSelectField.getValueAsync(recordId)  // Promise<Array<{id, name}> | null>
await multiSelectField.setValueAsync(recordId, optionIds: string[])  // Promise<boolean>
multiSelectField.getOptions()  // Array<{id, name, color}>
multiSelectField.addOption(name)  // string
```

#### Attachment Field
```typescript
await attachmentField.getValueAsync(recordId)  // Promise<AttachmentValue[] | null>
await attachmentField.setValueAsync(recordId, file: IOpenFile | IOpenFile[])  // Promise<boolean>
await attachmentField.getAttachmentUrls(recordId)  // Promise<string[]>
```

#### URL Field
```typescript
await urlField.getValueAsync(recordId)  // Promise<{link, text?} | null>
await urlField.setValueAsync(recordId, url: string | {link, text?})  // Promise<boolean>
```

#### User Field
```typescript
await userField.getValueAsync(recordId)  // Promise<Array<{unionId, userId, name?}> | null>
await userField.setValueAsync(recordId, users: Array<{userId?, unionId?}>)  // Promise<boolean>
```

#### Link Fields (Uni/Bidirectional)
```typescript
await linkField.getValueAsync(recordId)  // Promise<{linkedRecordIds: string[]} | null>
await linkField.setValueAsync(recordId, value: {linkedRecordIds: string[]})  // Promise<boolean>
```

#### Rating Field
```typescript
await ratingField.getValueAsync(recordId)  // Promise<number | null>
await ratingField.setValueAsync(recordId, value: number)  // Promise<boolean>
ratingField.getMin()  // number
ratingField.getMax()  // number
```

#### Progress Field
```typescript
await progressField.getValueAsync(recordId)  // Promise<number | null>
await progressField.setValueAsync(recordId, value: number)  // Promise<boolean>
progressField.getMin()  // number
progressField.getMax()  // number
```

#### Currency Field
```typescript
await currencyField.getValueAsync(recordId)  // Promise<number | null>
await currencyField.setValueAsync(recordId, value: number | string)  // Promise<boolean>
currencyField.getDecimalDigits()  // number
currencyField.getCurrencyType()  // CurrencyType
```

### Input Methods
```typescript
await Input.textAsync(label: string)  // Promise<string>
await Input.selectAsync(label: string, options: string[])  // Promise<string>
await Input.formAsync(title: string, items: FormItem[])  // Promise<Record<string, any>>
```

### Output Methods
```typescript
Output.log(message: any)        // 普通日志
Output.info(message: any)       // 提示信息（蓝色）
Output.warn(message: any)       // 警告信息（黄色）
Output.error(message: any)      // 错误信息（红色）
Output.markdown(message: string)  // Markdown格式
Output.table(data: any)         // 表格展示
Output.clear()                  // 清空运行面板
```

## Type Definitions

### IOpenFile
```typescript
interface IOpenFile {
  name: string;
  type: string;
  size: number;
  content: string;  // base64
}
```

### AttachmentValue
```typescript
type AttachmentValue = Array<{
  type: string;
  filename: string;
  url: string;
  size?: number;
  resourceId?: string;
}>;
```

### GetRecordsOptions
```typescript
interface GetRecordsOptions {
  recordIds?: string[];
  fieldIds?: string[];
  pageSize?: number;  // 默认100，最大100
  cursor?: string;
  viewId?: string;
}
```

### RecordToInsert
```typescript
interface RecordToInsert {
  fields: Record<string, CellValue>;
}
```

### RecordToUpdate
```typescript
interface RecordToUpdate {
  id: string;
  fields: Record<string, CellValue>;
}
```

## Common Patterns

### Batch Processing Pattern
```typescript
const batchSize = 50;
while (updates.length > 0) {
  const batch = updates.slice(0, batchSize);
  await sheet.updateRecordsAsync(batch);
  updates.splice(0, batchSize);
}
```

### Pagination Pattern
```typescript
const allRecords = [];
let hasMore = true;
let cursor = "";

while (hasMore) {
  const result = await sheet.getRecordsAsync({
    pageSize: 100,
    cursor: cursor,
  });
  allRecords.push(...result.records);
  hasMore = result.hasMore;
  cursor = result.cursor;
}
```

### Type-Safe Field Access
```typescript
const field = sheet.getField('fieldName');
if (Base.isFieldOfType(field, 'singleSelect')) {
  const options = field.getOptions();
  // Type-safe operations
}
```

### Error Handling Pattern
```typescript
try {
  // Operations
  Output.log('操作成功');
} catch (error) {
  if (error instanceof Error) {
    Output.error(`执行过程中发生错误: ${error.message}`);
  } else {
    Output.error(`执行过程中发生未知错误`);
  }
}
```

## Limitations

- Batch operations: max 50-100 records per call
- PageSize: max 100 records per getRecordsAsync call
- InsertRecordsAsync: max 500 records per call
- UpdateRecordsAsync: max 100 records per call
- DeleteRecordsAsync: max 100 records per call

## Important Notes

1. **Never invent APIs**: Only use methods documented in references/api/
2. **Always check field types**: Use `Base.isFieldOfType()` before type-specific operations
3. **Match value types**: Ensure values match expected field type formats
4. **Use batch processing**: Process records in batches to avoid limits
5. **Handle errors gracefully**: Always wrap operations in try-catch blocks
6. **Provide user feedback**: Use Output methods to inform users of progress