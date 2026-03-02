## 插件执行函数 - execute

execute 是字段模板实际的业务逻辑，目前仅支持 Nodejs 运行时。

### 入参

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| context | Context | 每次执行的上下文，详见下方定义。 |
| formData | object | 实际运行时，用户在 UI 组件上配置的参数。<br>*   该对象的参数和 formItems 中的 key 保持一致<br>    <br>*   value 与 formItems 中定义的组件返回值一致，如果是字段选择，会将当前行此字段的单元格值返回。<br>    <br>```typescript<br>{<br>    "textKey": "文本值",<br>    "numberKey": 1.23,<br>}<br>``` |

### context 定义

context 是 Faas 函数运行时的上下文信息

| 参数 | 类型 | 示例值 | 说明 |
| --- | --- | --- | --- |
| fetch | (url, options) => Promise<Response> |  | 请求外部数据的 API，语法参考：[node-fetch](https://github.com/node-fetch/node-fetch) |
| baseId | string |  | AI表格格唯一标识 |
| sheetId | string |  | 数据表 id |
| extensionId | string |  | 字段模板唯一标识 |
| tenantId | string |  | 租户 id |

### 返回值

`execute` 必须要有一个返回值，其中 `code`表示运行结果，`msg` 表示异常信息，`data` 表示数据

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `code` | `FieldExecuteCode` | `execute` 执行结果，具体值见下方 `FieldExecuteCode` 定义 |
| `data` | `object` | 返回的数据，需要和 `resultType` 保持一致，支持的结果见上面章节：[《AI表格字段模板开发指南（FaaS版）》](https://alidocs.dingtalk.com/i/nodes/1R7q3QmWeljPoM5BSGPbvaNO8xkXOEP2?utm_scene=team_space&iframeQuery=anchorId%3Duu_mc35kwg2setdj2qkqw) |
| `msg` | `string` | `execute` 执行错误信息，仅用于开发者排查使用，不会向用户透出 |
| `errorMessage` | `string` | 详细错误信息，仅在 `code` 为`FieldExecuteCode.Error` 时才生效 |

`FieldExecuteCode`

| code 值 | 含义 |
| --- | --- |
| FieldExecuteCode.Success | 运行成功 |
| FieldExecuteCode.Error | 通用的插件运行失败 |
| FieldExecuteCode.RateLimit | 限流 |
| FieldExecuteCode.QuotaExhausted | quota 耗尽 |
| FieldExecuteCode.ConfigError | 配置错误，即用户在配置面板选择的值不合法可以返回该错误码 |
| FieldExecuteCode.InvalidArgument | 参数错误，即用户所选配置的内容合法，但是代码中未兼容等情况 |

### 自定义错误信息

如果默认的错误提示不满足需求，可以通过`errorMessage`来自定义错误提示，注意：**仅在** `**code**` **为**`**FieldExecuteCode.Error**` **时才生效，**建议尽量使用内置的错误码

为了支持国际化，需要搭配`errorMessages`使用，具体逻辑是 `execute` 返回 `errorMessage`，例如 error，最终用户看到的是`errorMessages`中 对应的值，即 error 这个 key 对应的值，支持引用国际化资源，参考代码如下：

```JSON
{
  i18nMap: {
    'zh-CN': {
      // 定义国际化资源
      'errorTips': '错误提示',
    },
    'en-US': {
      'errorTips': '',
    },
    'ja-JP': {
      'errorTips': '',
    },
  },
  errorMessages: {
    // 定义错误信息集合
    'error': t('errorTips')
  }
  execute: async (context, formItemParams: any) => {
    return {
      code: FieldExecuteCode.Error,
      // 返回的值需要在errorMessages中存在
      errorMessage: 'error',
    };
  }
}
```

### 域名白名单

`execute` 函数调用外部 API 时，需要先声明白名单，否则请求会被拒绝，其中白名单配置规则如下：

*   域名需要包含主机名，例如 example.com
    
*   域名支持使用 IP 地址（支持 IPV4 和 IPV6）
    
*   不支持配置端口
    
*   仅支持配置域名，带上协议、路径会导致匹配失败
    

示例如下：

```tsx
fieldDecoratorKit.setDomainList(['example.com']); // 可以打开 https://doc.example.com, https://img.example.com

fieldDecoratorKit.setDomainList(['192.168.1.1']); // 可以打开 http://192.168.1.1:{{port}}，其中任意端口号都可以访问

fieldDecoratorKit.setDomainList(['https://example.com']); // ❌带上了协议会导致无法正确识别域名

fieldDecoratorKit.setDomainList(['example.com/path']); // ❌带上了路径会导致无法正确识别域名
```

### 运行环境

| 参数 | 详情 |
| --- | --- |
| Node.js 版本 | 16.x |
| 单实例规格 | 1 核 1G |
| 超时时间 | 15 分钟 |
| 服务隔离 | 按照插件 + 组织的维度隔离 |
| 扩缩容 | 支持动态扩缩容，最大 n 个实例 |

运行环境限制：

1.  请求的并发数不超过 10n
    
2.  以下三方库无法在沙箱内运行
    
    1.  axios
        
    2.  got
        
    3.  bcrypt
        
    4.  moment
        
    5.  jsdom
        
    6.  sharp
        
    7.  crypto（使用 crypto-js 替代）
        
3.  以下全局对象是由沙箱注入，如果你依赖这些对象的原型链做判断时，可能会出现预期外的结果
    
    1.  URL
        
    2.  Buffer
        
    3.  Uint8Array
        
    4.  URLSearchParams
        

## 授权

授权不是字段模板的必选项，取决于字段模板是否依赖其他三方平台的凭证。如果依赖三方平台的凭证，强烈建议通过授权的方式来保存凭证，保护用户的数据安全。

### APIKey 授权模式

目前字段模板支持以下几种 APIKey 授权模式。注意：**授权模式不支持向下兼容，例如从没有授权到配置了授权，需要开发者关注并且做好兼容**

### 使用

**HeaderBearToken**

**介绍**

用户输入 APIKey 后，字段模板框架在请求时会在 header 中带上请求头

```JavaScript
Authorization: Bearer APIKey
```

服务端接收到的请求示例：

```JSON
{
  headers:{
    authorization: "Bearer AAAAAA"
  }
}
```

**使用**

代码示例：

```typescript
fieldDecoratorKit.setDecorator({
  authorizations: 
    {
      id: 'auth_id',// 授权的id，用于context.fetch第三个参数指定使用
      platform: 'xxx',// 授权平台，目前可以填写当前平台名称
      type: AuthorizationType.HeaderBearerToken, // 授权类型
      required: false,// 设置为选填，用户如果填了授权信息，请求中则会携带授权信息，否则不带授权信息
      instructionsUrl: "https://xxx",// 帮助链接，告诉使用者如何填写这个apikey
      label: '测试授权', // 授权平台，告知用户填写哪个平台的信息
      tooltips: '请配置授权', // 提示，引导用户添加授权
      icon: { // 当前平台的图标
        light: '', 
        dark: ''
      }
    }
  ,
  execute: async (params, context) => {
    const url = 'https://xxx';// 已经在setDomainList中添加为白名单的请求
    // 通过指定context.fetch第3个参数为授权id： auth_id。则会在请求头带上 Authorization: Bearer APIKey
    const res = await context.fetch(url, {
      method: 'POST',
    }, 'auth_id');// 第三个参数为某个授权的id
  }
});
```

**本地调试**

用户授权的信息是由AI表格代为保存的，所以在本地调试阶段，不支持解密用户的授权信息，我们提供了本地 mock 的方式来调试，具体使用如下：

在根目录/config.json中设置mock值以进行本地调试，示例：

```typescript
{
  "authorizations": "token"
}
```

在 execute 中使用方式不变

```typescript
fieldDecoratorKit.setDecorator({
  execute: async (params, context) => {
    const url = 'https://xxx';// 已经在setDomainList中添加为白名单的请求
    // 通过指定context.fetch第3个参数为授权id： auth_id。则请求时会自动添加header
    const res = await context.fetch(url, {
      method: 'POST',
    }, 'auth_id');// 第三个参数为某个授权的id
  }
});
```

此时服务端收到的请求为：

```typescript
{
  headers:{
    authorization: "Bearer token"
  }
}
```

**MultiHeaderToken**

**介绍**

用户可以输入多个key，字段模板框架会在你请求时带上请求头。

服务端接收到的请求示例：

```JSON
"body": "",
"headers":{
    "content-length": "0",
    "id-a": "AAAAAA",
    "id-b": "BBBBBBB"
},
"url": "....."

```

**使用**

代码示例：

```typescript
fieldDecoratorKit.setDecorator({
  authorizations: 
    {
      id: 'auth_id',// 授权的id，用于context.fetch第三个参数指定使用
      platform: 'xxx',// 授权平台，目前可以填写当前平台名称
      type: AuthorizationType.MultiHeaderToken, // 授权类型
      // 用户可以填写的key
      params: [
        { key: "id-a", placeholder: "id-a" },
        { key: "id-b", placeholder: "id-b" },
      ],
      required: false,// 设置为选填，用户如果填了授权信息，请求中则会携带授权信息，否则不带授权信息
      instructionsUrl: "https://xxx",// 帮助链接，告诉使用者如何填写这个apikey
      label: '测试授权', // 授权平台，告知用户填写哪个平台的信息
      tooltips: '请配置授权', // 提示，引导用户添加授权
      // 当前平台的图标
      icon: {
        light: '', 
        dark: ''
      }
    }
  ,
  execute: async (params, context) => {
    const url = 'https://xxx';// 已经在setDomainList中添加为白名单的请求
    // 通过指定context.fetch第3个参数为授权id： auth_id，则请求时会自动添加header
    const res = await context.fetch(url, {
      method: 'POST',
    }, 'auth_id');// 第三个参数为某个授权的id
  }
});
```

**本地调试**

用户授权的信息是由AI表格代为保存的，所以在本地调试阶段，不支持解密用户的授权信息，我们提供了本地 mock 的方式来调试，具体使用如下：

在根目录/config.json中设置mock值以进行本地调试，示例：

```typescript
{
  "authorizations": {
      "id-a": "AAAAAA",
      "id-b": "BBBBBBB"
    }
}
```

在 execute 中使用方式不变

```typescript
fieldDecoratorKit.setDecorator({
  execute: async (params, context) => {
    const url = 'https://xxx';// 已经在setDomainList中添加为白名单的请求
    // 通过指定context.fetch第3个参数为授权id： auth_id。则会在请求头带上 Authorization: Bearer APIKey
    const res = await context.fetch(url, {
      method: 'POST',
    }, 'auth_id');// 第三个参数为某个授权的id
  }
});
```

此时服务端收到的请求为：

```typescript
{
  headers:{
    "id-a": "AAAAAA",
    "id-b": "BBBBBBB"
  }
}
```