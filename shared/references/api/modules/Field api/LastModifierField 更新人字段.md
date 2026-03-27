# LastModifierField 更新人字段

`LastModifierField` 继承自基础 [Field](../Field%20模块.md) 类，专门用于处理更新人字段数据。系统自动记录行记录最后一次被修改的用户信息，返回用户的 unionId 和名称。

:::
更新人字段是系统自动生成的只读字段，不能手动设置值。字段类型代码为 `lastModifier`。
:::

## 字段特有方法

### getValueAsync

获取指定行记录该更新人字段的值。

```typescript
getValueAsync: (recordId: string) => Promise<UserCellValue | null>
```

**参数**

- `recordId`: `string` - 记录ID

**返回值**

- [`Promise<UserCellValue | null>`](../../interface/API%20类型定义.md) - 最后更新人信息，包含用户 unionId 和名称，当字段值为空时返回 null

**示例**

```typescript
// 边栏/脚本插件（TypeScript 泛型写法）
const updaterField = sheet.getField<LastModifierField>('更新人');
if (updaterField) {
  const updater = await updaterField.getValueAsync('rec123456');
  if (updater) {
    console.log(`最后更新人: ${updater.name}`);
  }
}
```

```typescript
// 脚本插件（isFieldOfType 写法）
const updaterField = sheet.getField('更新人');
if (Base.isFieldOfType(updaterField, 'lastModifier')) {
  const updater = await updaterField.getValueAsync('rec123456');
  if (updater) {
    Output.log(`最后更新人: ${updater.name}`);
  }
}
```

## 最佳实践

### 筛选出由特定用户最后更新的记录

以下示例展示如何遍历数据表，找出由当前登录用户最后更新的所有记录。

**脚本插件示例**

```typescript
async function findRecordsUpdatedByMe() {
  const activeSheet = Base.getActiveSheet();
  if (!activeSheet) {
    Output.error('当前没有激活的数据表');
    return;
  }

  // 获取当前用户信息
  const currentUser = await Base.getCurrentUser();
  if (!currentUser) {
    Output.error('无法获取当前用户信息');
    return;
  }

  const updaterField = activeSheet.getField('更新人');
  if (!Base.isFieldOfType(updaterField, 'lastModifier')) {
    Output.error('未找到更新人字段');
    return;
  }

  const matchedRecordIds: string[] = [];

  // 分页获取所有记录
  let cursor: string | undefined;
  do {
    const result = await activeSheet.getRecordsAsync({ pageSize: 100, cursor });
    if (!result) break;

    for (const record of result.records) {
      const updater = await updaterField.getValueAsync(record.getId());
      if (updater && updater.unionId === currentUser.unionId) {
        matchedRecordIds.push(record.getId());
      }
    }


    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  Output.log(`由我最后更新的记录共 ${matchedRecordIds.length} 条`);
  Output.log(matchedRecordIds.join('\n'));
}

await findRecordsUpdatedByMe();
```

**关键点说明**：

- **只读字段**：更新人字段由系统自动维护，不支持通过 `setValueAsync` 写入
- **字段类型判断**：使用 `Base.isFieldOfType(field, 'lastModifier')` 进行类型安全判断
- **值结构**：返回值为 `UserCellValue[]`，每项包含 `unionId` 和可选的 `name`
- **与创建人的区别**：更新人记录的是**最后一次修改**该行的用户，每次有人编辑记录后都会自动更新
