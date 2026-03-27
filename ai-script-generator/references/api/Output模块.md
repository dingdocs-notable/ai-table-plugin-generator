# Output模块

# Output 模块

支持在运行页面中展示丰富的数据信息，类似于Console API。

### log

在运行插件面板打印文本信息，背景色为透明色，一般用于输出提示信息,。

```typescript
log: (message: any) => void;

```

**参数**

*   `message`: `any` - 需要打印的信息
    

**示例**

```typescript
Output.log('日志信息');

```

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Q35O851wgBDDEl9V/img/2346149c-b62d-4a6e-952f-d02792d58b57.png)

### info

在运行插件面板打印文本信息，背景色为蓝色，一般用于输出提示信息,。

```typescript
info: (message: any) => void;

```

**参数**

*   `message`: `any` - 需要打印的提示
    

**示例**

```typescript
Output.info('提示信息');

```

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Q35O851wgBDDEl9V/img/53e80c8d-bd8d-4b20-870b-967e78ecb0fd.png)

### warn

在运行插件面板打印文本信息，背景色为黄色，一般用于输出警告信息,。

```typescript
warn: (message: any) => void;

```

**参数**

*   `message`: `any` - 需要打印的提示
    

**示例**

```typescript
Output.warn('告警信息');

```

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Q35O851wgBDDEl9V/img/6391438c-af6c-4bcb-8fe3-b5ed13fb2308.png)

### error

在运行插件面板打印文本信息，背景色为红色，一般用于输出错误信息,。

```typescript
info: (message: any) => void;

```

**参数**

*   `message`: `any` - 需要打印的提示
    

**示例**

```typescript
Output.error('错误信息');

```

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Q35O851wgBDDEl9V/img/024e971d-b54a-47cd-9e7e-acda507444f8.png)

### success

在运行插件面板打印文本信息，背景色为绿色，一般用于输出成功信息。

```typescript
success: (message: any) => void;

```

**参数**

*   `message`: `any` - 需要打印的信息
    

**示例**

```typescript
Output.success('操作成功');

```

### markdown

在运行插件面板中打印富文本内容，支持标准的markdown语法。

```typescript
markdown: (message: string) => void;
```

**参数**

*   `message`: `string` - 标准markdown规范的字符串
    

**示例**

```typescript
Output.markdown(`## Document Title

## Section 1: Introduction

This is an introductory paragraph. Markdown allows for easy formatting of text.

### Sub-section 1.1: Features

-   **Bold text** using double asterisks or double underscores.
-   *Italic text* using single asterisks or single underscores.
-   \`Inline code\` using backticks.

## Section 2: Code Example

Here is an example of a code block:

\`\`\`python
def hello_world():
    print("Hello, Markdown!")`);

```

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Q35O851wgBDDEl9V/img/1f371fcb-d2f6-46a6-a58d-6221fff3ac71.png)

### table

在运行插件面板中以表格形式展示数组或对象。

```typescript
table: (data: unknown) => void
```

**参数**

*   `data`: `unknown` - 通常为可序列化的数组或对象
    

**示例**

```typescript
Output.table([
  { name: 'John', age: 15, gender: 'Male' },
  { name: 'Alice', age: 24, gender: 'Female' },
  { name: 'Bob', age: 22, gender: 'Male' },
]);
```

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Q35O851wgBDDEl9V/img/9b57fc6d-c58e-4779-a4bf-bfe3bff9479e.png)

### clear

清空运行插件面板中的所有输出内容。

```typescript
clear: () => void;
```

**示例**

```typescript
Output.log('这条信息会被清除');
Output.clear();
Output.log('面板已清空，这是新的输出');
```