# CreatorField 创建人字段

`CreatorField` 继承自基础 [Field](../Field%20模块.md) 类，专门用于处理创建人字段数据。系统自动记录行记录的创建人信息，返回用户的 unionId 和名称。

:::
创建人字段是系统自动生成的只读字段，不能手动设置值。字段类型代码为 `creator`。
:::

## 字段特有方法

### getValueAsync

获取指定行记录该创建人字段的值。

```typescript
getValueAsync: (recordId: string) => Promise<UserCellValue | null>
```

**参数**

- `recordId`: `string` - 记录ID

**返回值**

- [`Promise<UserCellValue | null>`](../../interface/API%20类型定义.md) - 创建人信息，包含用户 unionId 和名称，当字段值为空时返回 null

**示例**

```typescript
// 边栏/脚本插件（TypeScript 泛型写法）
const creatorField = sheet.getField<CreatorField>('创建人');
if (creatorField) {
  const creator = await creatorField.getValueAsync('rec123456');
  if (creator) {
    console.log(`创建人: ${creator.name}`);
  }
}
```

```typescript
// 脚本插件（isFieldOfType 写法）
const creatorField = sheet.getField('创建人');
if (Base.isFieldOfType(creatorField, 'creator')) {
  const creator = await creatorField.getValueAsync('rec123456');
  if (creator) {
    Output.log(`创建人: ${creator.name}`);
  }
}
```

## 最佳实践

### 读取所有记录的创建人信息

以下示例展示如何遍历数据表中所有记录，读取创建人字段的值并汇总输出。

**脚本插件示例**

```typescript
async function listRecordCreators() {
  const activeSheet = Base.getActiveSheet();
  if (!activeSheet) {
    Output.error('当前没有激活的数据表');
    return;
  }

  const creatorField = activeSheet.getField('创建人');
  if (!Base.isFieldOfType(creatorField, 'creator')) {
    Output.error('未找到创建人字段');
    return;
  }

  // 分页获取所有记录
  let cursor: string | undefined;
  do {
    const result = await activeSheet.getRecordsAsync({ pageSize: 100, cursor });
    if (!result) break;

    for (const record of result.records) {
      const creator = await creatorField.getValueAsync(record.getId());
      if (creator) {
        Output.log(`记录 ${record.getId()} 的创建人: ${creator.name}`);
      }
    }


    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);
}

await listRecordCreators();
```

**关键点说明**：

- **只读字段**：创建人字段由系统自动维护，不支持通过 `setValueAsync` 写入
- **字段类型判断**：使用 `Base.isFieldOfType(field, 'creator')` 进行类型安全判断
- **值结构**：返回值为 `UserCellValue[]`，每项包含 `unionId` 和可选的 `name`
