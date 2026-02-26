# UI 模块

UI 模块提供了与用户界面交互的能力，支持显示消息提示、获取和设置选区等功能。

获取方式：

```typescript
const ui = DingdocsScript.base.ui;
```
```typescript
const ui = Base.ui
```

## toast

显示一个消息提示，用于向用户反馈操作结果或重要信息。

```typescript
toast: (toastOptions: ToastOptions) => Promise<{ success: boolean }>;

interface ToastOptions {
  /** toast提示类型 */
  type: ToastType;
  /** toast内容 */
  message: string;
  /** 是否提供手动关闭消息按钮，（当消息常驻时固定为true） */
  closeable?: boolean;
  /** 手动关闭消息的回调 */
  onClose?: () => void;
  /** 消息显示持续时间。默认为short模式持续 3s, 选择long或存在行动点时持续时间为 5s,选择always时常驻在页面中。 */
  keepAlive?: 'always' | 'short' | 'long';
}

enum ToastType {
  /** 成功 */
  SUCCESS = 'success',
  /** 失败 */
  ERROR = 'error',
  /** 警告 */
  WARNING = 'warning',
  /** 提示 */
  INFO = 'info',
}

```

**参数**

*   `toastOptions`: [`ToastOptions`] - 消息提示
    

**返回值**

*   `Promise<{ success: boolean }>` - 消息提示结果，返回操作是否成功
    

**示例**

### 基础用法

显示一个成功提示：

```typescript
await ui.toast({
  type: ToastType.SUCCESS,
  message: '操作成功！',
});

```

显示一个错误提示：

```typescript
await ui.toast({
  type: ToastType.ERROR,
  message: '操作失败，请重试',
});

```

### 自定义持续时间

显示一个持续 5 秒的警告提示：

```typescript
await ui.toast({
  type: ToastType.WARNING,
  message: '请注意数据安全',
  keepAlive: 'long',
});

```

显示一个常驻的提示消息：

```typescript
await ui.toast({
  type: ToastType.INFO,
  message: '重要通知：系统将在今晚维护',
  keepAlive: 'always',
});

```

### 可关闭的消息

显示一个可手动关闭的消息，并在关闭时执行回调：

```typescript
await ui.toast({
  type: ToastType.INFO,
  message: '数据正在处理中...',
  closeable: true,
  onClose: () => {
    Output.log('用户关闭了消息提示');
  },
});

```

**注意事项**

1.  当 `keepAlive` 设置为 `'always'` 时，`closeable` 会自动设置为 `true`，确保用户可以手动关闭常驻消息
    
2.  不同的消息类型会以不同的背景色显示：
    
    *   `SUCCESS`: 绿色背景
        
    *   `ERROR`: 红色背景
        
    *   `WARNING`: 黄色背景
        
    *   `INFO`: 蓝色背景