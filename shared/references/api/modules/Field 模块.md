# Field 模块

Field 接口提供了操作数据表字段的方法，包括获取字段基本信息、修改字段属性以及操作字段值等功能。

通常我们通过 [Sheet 模块](../modules/Sheet%20模块.md) 创建或获取字段，如下所示：

```typescript
const singleSelectField = sheet.getField<SingleSelectField>(fieldNameOrId);
```

值得注意的是，我们在调用 `getField` 方法时传入了指定的类型 `<SingleSelectField>`，我们非常推荐这样的用法，通过这样的方法获取的 `Field`，会有足够的类型提示，例如我们可以很方便地为这个单选字段新增选项:

```typescript
singleSelectField.addOption('Option1');
```

除了设置字段的属性之外，我们也推荐开发者从字段角度来对值进行增删改查操作例如：

```typescript
await singleSelectField.setValueAsync(recordOrId, 'OptionId1');
```

在脚本插件中，由于脚本编辑语言为javascript，可以通过Base上提供的isFieldOfType进行类型推断：

```typescript
if (sheet)
```

详细用法可以点击具体字段类型模块中查看，如[文本字段](./modules/Field%20api/TextField%20文本字段.md)。

:::
本文子目录中包含了目前已经支持所有字段类型，本文的后续介绍了一些通用的方法
:::

## 基本信息方法

### isValid

检查当前字段对象是否有效。

```typescript
isValid: () => boolean

```

**返回值**

*   `boolean` - 如果字段存在且有效返回true，否则返回false
    

**示例**

```typescript
if (field.isValid()) {
  console.log('字段有效，可以进行操作');
} else {
  console.log('字段无效或已被删除');
}

```
```typescript
if (field.isValid()) {
  Output.log('字段有效，可以进行操作');
} else {
  Output.log('字段无效或已被删除');
}

```

### getSheetId

获取字段所属数据表的ID。

```typescript
getSheetId: () => string

```

**返回值**

*   `string` - 数据表ID
    

**示例**

```typescript
const sheetId = field.getSheetId();

```

### getId

获取字段ID。

```typescript
getId: () => string

```

**返回值**

*   `string` - 字段ID
    

**示例**

```typescript
const fieldId = field.getId();

```

### isPrimary

当前字段对象是否为主键列。

```typescript
isPrimary: () => boolean

```

**返回值**

*   `boolean` - 是否为主键
    

**示例**

```typescript
if(field.isPrimary()) {
  console.log('当前字段为数据表主键');
} else {
  console.log('当前字段不是数据表主键')
}

```
```typescript
if(field.isPrimary()) {
  Output.log('当前字段为数据表主键');
} else {
  Output.log('当前字段不是数据表主键')
}

```

### getName

获取字段名称。

```typescript
getName: () => string

```

**返回值**

*   `string` - 字段名称
    

**示例**

```typescript
const fieldName = field.getName();

```

### setName

设置字段名称。

```typescript
setName: (name: string) => Field<T>

```

**参数**

*   `name`: `string` - 新的字段名称
    

**返回值**

*   `Field`  - 字段对象本身，支持链式调用
    

**示例**

```typescript
// 修改字段名称
field.setName('客户全名');

// 链式调用
field.setName('联系电话').getProperty();

```

**注意事项**

*   不能修改从其他数据源同步的字段名称
    
*   字段名称在同一数据表中必须唯一
    
*   需要有字段更新权限
    

### getType

获取字段类型。

```typescript
getType: () => FieldType

```

**返回值**

*   [`FieldType`](../interface/API%20类型定义.md) - 字段类型
    

**示例**

```typescript
const fieldType = field.getType();
console.log(`字段类型: ${fieldType}`);

// 根据字段类型执行不同操作
if (fieldType === 'singleSelect') {
  console.log('这是一个单选字段');
} else if (fieldType === 'date') {
  console.log('这是一个日期字段');
}

```
```typescript
const fieldType = field.getType();
console.log(`字段类型: ${fieldType}`);

// 根据字段类型执行不同操作
if (fieldType === 'singleSelect') {
  console.log('这是一个单选字段');
} else if (fieldType === 'date') {
  console.log('这是一个日期字段');
}

```

## 字段属性方法（不建议直接使用）

### getProperty

获取字段配置属性。

```typescript
getProperty: () => FieldProperty | undefined

```

**返回值**

*   [`FieldProperty | undefined`](../interface/API%20类型定义.md) - 字段的配置属性，不同类型的字段有不同的属性结构，具体可以参考[《字段数据结构》](../interface/字段类型结构.md)
    

**示例**

```typescript
const property = field.getProperty();

// 对于数字字段，获取格式设置
if (field.getType() === 'number') {
  console.log(`数字格式: ${property.format}`);
  console.log(`精度: ${property.precision}`);
}

```
```typescript
const property = field.getProperty();

// 对于数字字段，获取格式设置
if (field.getType() === 'number') {
  Output.log(`数字格式: ${property.format}`);
  Output.log(`精度: ${property.precision}`);
}

```

### setPropertyAsync

异步设置字段配置属性。

```typescript
setPropertyAsync: (property: FieldProperty) => Promise<Field<T>>
```

**参数**

`property`\- [`FieldProperty`](../interface/API%20类型定义.md) 字段的新配置属性

根据字段类型不同，支持传入的字段属性结构也不同，具体可以参考[《字段数据结构》](../interface/字段类型结构.md)

**返回值**

*   `Promise<Field<T>>` - 字段对象本身，支持链式调用
    

**示例**

```typescript
// 修改数字字段的格式
if (field.getType() === 'number') {
  await field.setPropertyAsync({
    formatter: 'FLOAT_1'
  })
}

```

**注意事项**

*   不同类型的字段有不同的属性结构
    
*   某些字段属性修改可能需要更新整列数据，会触发数据加载
    
*   需要有字段更新权限
    

## 记录方法

### getFieldValuesAsync

分页获取整列字段值。

```typescript
getFieldValuesAsync: (options?: GetFieldValuesOptions) => Promise<PagedFieldValues<T> | null>;
```

**参数**

`options`\- [`GetFieldValuesOptions`](../interface/API%20类型定义.md) 可选项，分页获取参数

**返回值**

*   [`Promise<PagedFieldValues<T> | null>`](../interface/API%20类型定义.md) - 分页获取结果
    

**示例**

```typescript
const result = await field.getFieldValuesAsync({
  pageSize: 20,
});
if (result) {
  const { fieldValues, hasMore, cursor, total } = result;
}
```

## 类型化字段

Field类支持泛型，可以获取特定类型的字段:

```typescript
// 获取特定类型的字段
const selectField = sheet.getField<SelectField>('状态');
if (selectField) {
  // 可以使用SelectField特有的方法
  const options = selectField.getOptions();
}

const numberField = sheet.getField<NumberField>('金额');
if (numberField) {
  // 可以使用NumberField特有的方法
  const format = numberField.getFormat();
}

```

**注意事项**

*   确保获取的字段类型与指定泛型匹配，否则可能导致运行时错误
    
*   当不确定字段类型时，可以先通过getType()方法判断