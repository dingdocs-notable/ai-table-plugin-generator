## 插件返回结果 - resultType

`resultType`定义了字段模板返回值的类型，注意：`**resultType**` **中声明的类型需要和** `**execute**` **函数返回的类型一致，否则校验不通过，数据不会写入到AI表格**

### Text

返回文本数据

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| type | FieldType.Text | 是 | 声明返回为文本字段 |

execute 返回值类型： `string`

**示例**

```typescript
{
  resultType: {
    type: FieldType.Text,
  },
  execute: async (context, formItemParams: any) => {
    return {
      code: FieldExecuteCode.Success,
      data: 'string', // data必须为字符串
    };
  }
}

```

### Number

返回数字数据

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| type | FieldType.Number | 是 | 声明返回为文本字段 |

execute 返回值类型： `number`

**示例**

```typescript
{
  resultType: {
    type: FieldType.Text,
  },
  execute: async (context, formItemParams: any) => {
    return {
      code: FieldExecuteCode.Success,
      data: 123,
    };
  }
}

```

### SingleSelect

返回单选，类型如下：

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| type | FieldType.SingleSelect | 是 | 声明返回为单选字段 |
| extra | object | 是 | 单选字段 |
| extra.options | Array<{ name: string }> | 是 | 单选字段的选项 |

execute 返回值类型：`string`

**示例**

```typescript
{
  resultType: {
    type: FieldType.SingleSelect,
    extra: {
      options: [
        {
          name: '选项1'
        },
        {
          name: '选项2'
        }
      ]
    }
  },
  execute: async (context, formItemParams: any) => {
    return {
      code: FieldExecuteCode.Success,
      data: '选项1',
    };
  }
}
```

### MultiSelect

返回多选，类型如下：

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| type | FieldType.MultiSelect | 是 | 声明返回为多选字段 |
| extra | object | 是 | 多选字段 |
| extra.options | Array<{ name: string }> | 是 | 多选字段的选项 |

execute 返回值类型：`Array<string>`

**示例**

```typescript
{
  resultType: {
    type: FieldType.MultiSelect,
    extra: {
      options: [
        {
          name: '选项1'
        },
        {
          name: '选项2'
        }
      ]
    }
  },
  execute: async (context, formItemParams: any) => {
    return {
      code: FieldExecuteCode.Success,
      data: ['选项1', '选项2'],
    };
  }
}
```

### Link

返回链接数据

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| type | FieldType.Link | 是 | 声明返回为链接字段 |

execute 返回值类型：

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| text | string | 是 | 链接文本 |
| link | string | 是 | 链接值 |

**示例**

```typescript
{
  resultType: {
    type: FieldType.Link,
  },
  execute: async (context, formItemParams: any) => {
    return {
      code: FieldExecuteCode.Success,
      data: {
        text: 'link text',
        link: 'https://link.url'
      },
    };
  }
}
```

### Attachment

返回附件，类型如下：

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| type | FieldType.Attachment | 是 | 声明返回为附件字段 |

execute 返回值类型：

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| fileName | string | 是 | 附件名称 |
| type | string | 是 | 附件类型 |
| url | string | 是 | 附件地址，需要公开可访问 |

**示例**

```typescript
{
  resultType: {
    type: FieldType.Attachment,
  },
  execute: async (context, formItemParams: any) => {
    return {
      code: FieldExecuteCode.Success,
      data: [{
        fileName: '测试附件.png',
        type: 'image',
        url: 'https://attachment.url'
      }],
    };
  }
}
```

### Object

返回Object，类型如下：

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| type | FieldType.Object | 是 | 声明返回为Object字段 |
| extra | object | 是 | 多选字段 |
| extra.properties | object\[\] | 是 | Object 字段的属性 |
| extra.icon | {<br>    light: string;<br>    dark?: string;<br> } | 否 | Object 字段的图标 |

其中 extra.properties 支持以下配置

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| key | string | 是 | Object 属性字段的 key，会从 execute 返回值中取值，例如：execute 返回值为 data，则这个字段的值为 data\[key\] |
| type | FieldType.Text | 是 | Object 属性字段类型，目前只支持文本类型 |
| title | string | 是 | Object 属性字段的名称 |
| primary | boolean | 否 | 标记该属性为用于排序的主属性。注意：<br>`properties` 数组中必须有一个 `primary` 值为`true`表示主属性，且不能被隐藏。如果不满足这个限制，则不会更新 object 字段 |
| hidden | boolean | 否 | 是否在字段面板中隐藏该字段 |

execute 返回值类型：`object`

**示例**

```typescript
{
  resultType: {
    type: FieldType.Object,
    properties: [
      {
        key: 'prop1',
        type: FieldType.Text,
        title: '属性1',
        primary: true
      },
      {
        key: 'prop2',
        type: FieldType.Text,
        title: '属性2',
        primary: true
      }
    ],
    icon: {
      light: 'https://iconlight.png'
    }
  },
  execute: async (context, formItemParams: any) => {
    return {
      code: FieldExecuteCode.Success,
      data: {
        prop1: 'prop1 value',
        prop2: 'prop2 value'
      },
    };
  }
}
```