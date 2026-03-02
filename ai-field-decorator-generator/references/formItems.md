## 插件配置项 UI - formItems

`formItems`用于定义字段模板的配置项 UI，并且可以负责接收用户实际配置的值

### Textarea 组件

多行文本输入组件，用户可手动输入，`props`支持以下参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| placeholder | string | 输入框提示文字 |
| enableFieldReference | boolean | 是否支持引用字段 |

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/eYVOL5jz3Q6yzlpz/img/6fc35bdb-ff84-4971-83f8-871882367ecb.png)

|  | 类型 | 说明 |
| --- | --- | --- |
| execute 函数入参 | string | 使用 `Textarea` 组件，AI表格格会传递字符串给`execute`函数 |

**代码示例**

```typescript
{
  // ...
  formItems: [
    {
      key: 'demo',
      label: '文本示例',
      component: FormItemComponent.Textarea,
      props: {
        placeholder: '请输入',
      },
      validator: {
        required: true,
      }
    },
  ],
  resultType: {
    type: FieldType.Text,
  },
  execute: async (context, formData) => {
    const str = formData.demo;
    return {
      code: FieldExecuteCode.Success,
      data: str,
    };
  },
}
```

### SingleSelect 组件

下拉单选组件，用户手动选择下拉项里的值，`props` 支持以下参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| placeholder | string | 输入框提示文字 |
| options | Array<{<br>    key: string;<br>    title: string;<br>  }> | 选项数据，其中为`title`展示文案，`key`为实际值 |
| defaultValue | string | 初始值，为 options 里某一项的 key |

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/eYVOL5jz3Q6yzlpz/img/923926b3-9e4e-4c8a-b675-07458faf23f5.png)

|  | 类型 | 说明 |
| --- | --- | --- |
| execute 函数入参 | string | 使用 `SingleSelect` 组件，AI表格格会传递「所选配置项的 `key`」给`execute`函数 |

**代码示例**

```typescript
{
  // ...
  formItems: [
    {
      key: 'demo',
      label: '单选示例',
      component: FormItemComponent.SingleSelect,
      props: {
        defaultValue: 'option1',
        placeholder: "请选择",
        options: [
          {
            key: "option1",
            title: "选项1"
          },
          {
            key: "option2",
            title: "选项2"
          }
        ]
      },
      validator: {
        required: true,
      }
    },
  ],
  resultType: {
    type: FieldType.Text,
  },
  execute: async (context, formData) => {
    const key = formData.demo;
    return {
      code: FieldExecuteCode.Success,
      data: key,
    };
  },
}
```

### MultiSelect 组件

下拉多选组件，用户手动选择下拉项里的值，`props` 支持以下参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| placeholder | string | 输入框提示文字 |
| options | Array<{<br>    key: string;<br>    title: string;<br>  }> | 选项数据，其中`title`为展示文案，`key`为实际值 |
| defaultValue | string\[\] | 初始值，每一项由 options 里的 key 组成 |

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/eYVOL5jz3Q6yzlpz/img/63f59202-d598-4c12-939d-2d1aed839528.png)

|  | 类型 | 说明 |
| --- | --- | --- |
| execute 函数入参 | Array<string> | 使用 `MultiSelect` 组件，AI表格格会传递「所选配置项的 `key`数组」给`execute`函数 |

**代码示例**

```typescript
{
  // ...
  formItems: [
    {
      key: 'demo',
      label: '多选示例',
      component: FormItemComponent.MultiSelect,
      props: {
        defaultValue: ['option1'],
        placeholder: "请选择",
        options: [
          {
            key: "option1",
            title: "选项1"
          },
          {
            key: "option2",
            title: "选项2"
          },
          {
            key: "option3",
            title: "选项3"
          }
        ]
      },
      validator: {
        required: true,
      }
    },
  ],
  resultType: {
    type: FieldType.Text,
  },
  execute: async (context, formData) => {
    const keyArray = formData.demo;
    return {
      code: FieldExecuteCode.Success,
      data: keyArray.join(','),
    };
  },
}
```

### Radio 组件

单选框组件，`props` 支持以下参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| options | Array<{<br>    value: string;<br>    label: string;<br>  }> | 选项数据，其中`label`为展示文案，`value`为实际值 |
| defaultValue | string | 初始值，为 options 里某一项的 value |

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/eYVOL5jz3Q6yzlpz/img/7de8343a-80ba-4115-a0a8-0a20a5c0f670.png)

|  | 类型 | 说明 |
| --- | --- | --- |
| execute 函数入参 | string | 使用 `Radio` 组件，AI表格格会传递「所选配置项的 `value`」给`execute`函数 |

**代码示例**

```typescript
{
  // ...
  formItems: [
    {
      key: 'demo',
      label: '单选框示例',
      component: FormItemComponent.Radio,
      props: {
        defaultValue: 'option1',
        options: [
          {
            value: "option1",
            label: "选项1"
          },
          {
            value: "option2",
            label: "选项2"
          }
        ]
      },
      validator: {
        required: true,
      }
    },
  ],
  resultType: {
    type: FieldType.Text,
  },
  execute: async (context, formData) => {
    const key = formData.demo;
    return {
      code: FieldExecuteCode.Success,
      data: key,
    };
  },
}
```

### FieldSelect 组件

字段选择组件，`props` 支持以下参数

| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| mode | 'single' \| 'multiple' | 否 | 单选 or 多选 |
| supportTypes | SupportTypes | 否 | 支持哪些字段类型，比如 \[FieldType.Text\]则只能选文本字段 |

目前支持如下类型：

```typescript
// 目前可支持字段类型：1.文本字段｜2.数字字段｜3.单选字段｜4.多选字段｜5.链接字段｜6.附件字段 
type SupportTypes = (
  FieldType.Text | 
  FieldType.Number | 
  FieldType.SingleSelect | 
  FieldType.MultiSelect | 
  FieldType.Link | 
  FieldType.Attachment
)[];
```

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/eYVOL5jz3Q6yzlpz/img/af17717b-c624-4852-9ed4-05489bd16e0b.png)

**代码示例**

```typescript
{
  // ...
  formItems: [
    {
      key: 'demo',
      label: '字段选择示例',
      component: FormItemComponent.FieldSelect,
      props: {
        mode: 'single',
        supportTypes: [FieldType.Text, FieldType.Number],
      },
      validator: {
        required: true,
      }
    },
  ],
  execute: async (context, formData) => {
    const value = formData.demo;
    return {
      code: FieldExecuteCode.Success,
      data: value,
    };
  },
}
```

选择不同类型的字段，会传递给不同类型的值给`execute`函数，以下是各种类型字段的`execute 函数入参`

#### 文本字段

|  | 类型 | 说明 |
| --- | --- | --- |
| execute 函数入参 | string | 选择`FieldType.Text`字段类型，会传递「所选字段列的文本内容」给`execute`函数 |

```typescript
// execute 函数入参类型
type TextFieldValue = string;

{
  // ...
  execute: async (context, formData) => {
    const value = formData.demo as TextFieldValue;
    return {
      code: FieldExecuteCode.Success,
      data: value,
    };
  },
}
```

#### 数字字段

|  | 类型 | 说明 |
| --- | --- | --- |
| execute 函数入参 | number | 选择`FieldType.Number`字段类型，会传递「所选字段列的数值」给`execute`函数 |

```typescript
// execute 函数入参类型
type NumFieldValue = number;

{
  // ...
  execute: async (context, formData) => {
    const value = formData.demo as NumFieldValue;
    return {
      code: FieldExecuteCode.Success,
      data: value,
    };
  },
}
```

#### 单选字段

|  | 类型 | 说明 |
| --- | --- | --- |
| execute 函数入参 | string | 选择`FieldType.SingleSelect`字段类型，会传递「所选字段列对应的选项值」给`execute`函数 |

```typescript
// execute 函数入参类型
type SingleSelectFieldValue = string;

{
  // ...
  execute: async (context, formData) => {
    const value = formData.demo as SingleSelectFieldValue;
    return {
      code: FieldExecuteCode.Success,
      data: value,
    };
  },
}
```

#### 多选字段

|  | 类型 | 说明 |
| --- | --- | --- |
| execute 函数入参 | string\[\] | 选择`FieldType.MultiSelect`字段类型，会传递「所选字段列对应的选项值数组」给`execute`函数 |

```typescript
// execute 函数入参类型
type MultiSelectFieldValue = string[];

{
  // ...
  execute: async (context, formData) => {
    const value = formData.demo as MultiSelectFieldValue;
    return {
      code: FieldExecuteCode.Success,
      data: value,
    };
  },
}
```

#### 链接字段

|  | 类型 | 说明 |
| --- | --- | --- |
| execute 函数入参 | LinkFieldValue | 选择`FieldType.Link`字段类型，会传递「链接相关信息」给`execute`函数 |

```typescript
// execute 函数入参类型
type LinkFieldValue = {
  url: string, // 链接地址
  text: string // 链接描述
};

{
  // ...
  execute: async (context, formData) => {
    const value = formData.demo as LinkFieldValue;
    return {
      code: FieldExecuteCode.Success,
      data: value,
    };
  },
}
```

#### 附件字段

|  | 类型 | 说明 |
| --- | --- | --- |
| execute 函数入参 | Array<Attachment> | 选择`FieldType.Attachment`字段类型，会传递「附件相关的信息」给`execute`函数 |

```typescript
// execute 函数入参类型
type Attachment = {
  name: string; // 附件名字
  type: string; // 附件类型
  size: number; // 附件大小
  tmp_url: string; // 附件链接
}
type AttachmentFieldValue = Array<Attachment>;

{
  // ...
  execute: async (context, formData) => {
    const value = formData.demo as AttachmentFieldValue;
    return {
      code: FieldExecuteCode.Success,
      data: value,
    };
  },
}
```