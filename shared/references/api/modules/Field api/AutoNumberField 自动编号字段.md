# AutoNumberField 自动编号字段

`AutoNumberField`，继承自基础 [Field](../Field%20模块.md) 类，专门用于处理自动编号字段数据。系统自动为每条记录生成唯一的编号，编号值以字符串形式存储。

:::
自动编号字段是系统自动生成的唯一标识，是一个只读字段，不能手动设置值。每新增一条记录，系统会自动分配一个递增的编号。
:::

## 字段特有方法

### getValueAsync

获取指定行记录该自动编号字段的值。

```typescript
getValueAsync: (recordId: string) => Promise<string | null>
```

**参数**

*   `recordId` : `string` - 记录ID
    

**返回值**

*   `Promise<string | null>` - 自动编号值，当字段值为空时返回null
    

**示例**

```typescript
// 获取自动编号字段值
const autoNumberField = sheet.getField<AutoNumberField>('编号');
if (autoNumberField) {
  const number = await autoNumberField.getValueAsync('rec123456');
  if (number !== null) {
    console.log(`自动编号: ${number}`);
  } else {
    console.log('未设置自动编号');
  }
}
```
```typescript
// 获取自动编号字段值
const autoNumberField = sheet.getField('编号');
if (Base.isFieldOfType(autoNumberField, 'autoNumber')) {
  const number = await autoNumberField.getValueAsync('rec123456');
  if (number !== null) {
    Output.log(`自动编号: ${number}`);
  } else {
    Output.log('未设置自动编号');
  }
}
```

## 使用场景

自动编号字段适用于以下场景：

- **订单编号**：为每个订单自动生成唯一编号
- **工单编号**：为每个工单分配递增的编号
- **客户编号**：为每个客户记录生成唯一标识
- **任务编号**：为项目中的任务自动编号

## 注意事项

1. 自动编号字段是只读的，无法通过 API 手动设置值
2. 删除记录后，该记录的编号不会被重新分配给新记录
3. 自动编号的格式由字段配置决定，可能包含前缀、日期等信息
