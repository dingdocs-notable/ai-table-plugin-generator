# UserField 人员字段

`UserField` 继承自基础 [`Field`](../modules/Field%20模块.md)类，专门用于处理人员类型数据。

在读写人员字段前，请先了解钉钉用户unionId和userId概念：

:::
**UserId**

UserId是员工在其所属组织中的唯一标识，仅在所属组织内是唯一标识符。同一个用户在不同组织中可以拥有不同的UserId。

[https://open.dingtalk.com/document/development/query-the-list-of-department-userids: https://open.dingtalk.com/document/development/query-the-list-of-department-userids](https://open.dingtalk.com/document/development/query-the-list-of-department-userids)
:::
:::
**Unionid**

UnionId是员工在当前开发者企业范围内的唯一标识，由系统生成。

对于开发边栏插件的用户而言，uniondId为插件所属企业范围内的唯一标识，同一个员工在不同的组织的企业内/三方插件下，unionid是不相同的。在同一个开发者企业账号下，unionid是唯一且不变的。

对于开发脚本插件的用户而言，unionId始终返回文档所属企业下的唯一标识。

[https://open.dingtalk.com/document/development/query-a-user-by-the-union-id: https://open.dingtalk.com/document/development/query-a-user-by-the-union-id](https://open.dingtalk.com/document/development/query-a-user-by-the-union-id)
:::

## 字段特有方法

### getValueAsync

获取指定记录在该人员字段中选择的人员。

```typescript
getValueAsync: (recordId: string) => Promise<UserCellValue[] | null>

```

**参数**

*   `recordId`: `string` - 记录ID
    

**返回值**

*   [`Promise<UserCellValue[] | null>`](../../interface/API%20类型定义.md)\- 选中的人员，返回用户名和用户unionId
    

**示例**

```typescript
// 获取记录的人员值
const userField = sheet.getField<UserField>('人员');
if (userField) {
  const users = await userField.getValueAsync('rec123456');
  console.log('查询到用户：', users.map((user) => (`用户名：${user.name}|用户unionId: ${user.unionId}`)).join('\n'));
}
```
```typescript
const userField = sheet.getField('人员');
if (Base.isFieldOfType(userField, 'user')) {
  const users = await userField.getValueAsync('rec123456');
  Output.log('查询到用户：\n', users.map((user) => (`用户名：${user.name}|用户unionId: ${user.unionId}`)).join('\n'));
}
```

### setValueAsync

设置指定记录在该人员字段中的人员值。

```typescript
setValueAsync: (recordId: string, value: UserCellValue[]) => Promise<boolean>
```

**参数**

*   `recordId`: `string` - 记录ID
    
*   `value`: [`UserCellValue[]`](../../interface/API%20类型定义.md) - 人员值，支持传入用户的userId或unionId
    

**返回值**

*   `Promise<boolean>`\- 操作是否成功
    

**示例**

```typescript
// 设置记录的选项值
const userField = sheet.getField<UserField>('人员');
if (userField) {
  const success = await userField.setValueAsync('rec123456', [{
    userId: 'user123',
  }, {
    unionId: 'xxxxx',
  }]);
  if (success) {
    console.log('向记录中更新了两名人员');
  } else {
    console.log('记录更新失败');
  }
}

```
```typescript
// 设置记录的选项值
const userField = sheet.getField('人员');
if (Base.isFieldOfType(userField, 'user')) {
  const success = await userField.setValueAsync('rec123456', [{
    userId: 'user123',
  }, {
    unionId: 'xxxxx',
  }]);
  if (success) {
    Output.log('向记录中更新了两名人员');
  } else {
    Output.log('记录更新失败');
  }
}

```

## 最佳实践

### 新增人员字段并写入当前用户

以下示例展示如何在当前激活的数据表中新增一个人员字段，并创建一条记录写入当前用户信息。

**实现逻辑**：
1. 获取当前用户信息
2. 获取当前激活的数据表，若无激活表则报错中止
3. 新增人员字段并插入一条记录，将当前用户写入该字段

**边栏插件示例**

```typescript
// script.ts - 服务层脚本
async function addUserFieldWithCurrentUser() {
  try {
    const base = DingdocsScript.base;
    
    // 1. 获取当前用户信息
    const currentUser = await base.getCurrentUser();
    if (!currentUser) {
      console.error('无法获取当前用户信息');
      return { success: false, message: '无法获取当前用户信息' };
    }
    console.log(`当前用户: ${currentUser.name}`);

    // 2. 获取当前激活的数据表
    const activeSheet = base.getActiveSheet();
    if (!activeSheet) {
      console.error('当前没有激活的数据表，请先选中一个数据表');
      return { success: false, message: '当前没有激活的数据表，请先选中一个数据表' };
    }
    console.log(`当前数据表: ${activeSheet.getName()}`);

    // 3. 新增人员字段
    const userFieldName = '负责人';
    let userField = activeSheet.getField(userFieldName);
    if (!userField) {
      userField = activeSheet.insertField(userFieldName, 'user');
      console.log(`已创建人员字段: ${userFieldName}`);
    } else {
      console.log(`人员字段已存在: ${userFieldName}`);
    }

    // 4. 插入一条记录，写入当前用户信息
    const newRecords = await activeSheet.insertRecordsAsync([
      {
        fields: {
          [userFieldName]: [{ unionId: currentUser.unionId }]
        }
      }
    ]);

    if (newRecords && newRecords.length > 0) {
      console.log(`成功创建记录，ID: ${newRecords[0].getId()}`);
      return { 
        success: true, 
        message: `已将当前用户 ${currentUser.name} 写入人员字段`,
        recordId: newRecords[0].getId()
      };
    }
    return { success: false, message: '创建记录失败' };
  } catch (error) {
    console.error(`执行失败: ${error instanceof Error ? error.message : '未知错误'}`);
    return { success: false, message: error instanceof Error ? error.message : '未知错误' };
  }
}

// 注册脚本函数
DingdocsScript.registerScript('addUserFieldWithCurrentUser', addUserFieldWithCurrentUser);
```

```typescript
// ui.tsx - UI层调用
const result = await Dingdocs.script.run('addUserFieldWithCurrentUser');
if (result.success) {
  console.log(result.message);
} else {
  console.error(result.message);
}
```

**脚本插件示例**

```typescript
async function addUserFieldWithCurrentUser() {
  try {
    // 1. 获取当前用户信息
    const currentUser = await Base.getCurrentUser();
    if (!currentUser) {
      Output.error('无法获取当前用户信息');
      return;
    }
    Output.log(`当前用户: ${currentUser.name}`);

    // 2. 获取当前激活的数据表
    const activeSheet = Base.getActiveSheet();
    if (!activeSheet) {
      Output.error('当前没有激活的数据表，请先选中一个数据表');
      return;
    }
    Output.log(`当前数据表: ${activeSheet.getName()}`);

    // 3. 新增人员字段
    const userFieldName = '负责人';
    let userField = activeSheet.getField(userFieldName);
    if (!userField) {
      userField = activeSheet.insertField(userFieldName, 'user');
      Output.log(`已创建人员字段: ${userFieldName}`);
    } else {
      Output.log(`人员字段已存在: ${userFieldName}`);
    }

    // 4. 插入一条记录，写入当前用户信息
    const newRecords = await activeSheet.insertRecordsAsync([
      {
        fields: {
          [userFieldName]: [{ unionId: currentUser.unionId }]
        }
      }
    ]);

    if (newRecords && newRecords.length > 0) {
      Output.log(`成功创建记录，ID: ${newRecords[0].getId()}`);
      Output.log(`已将当前用户 ${currentUser.name} 写入人员字段`);
    }
  } catch (error) {
    Output.error(`执行失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

await addUserFieldWithCurrentUser();
```

**关键点说明**：

- **获取当前用户**：使用 `Base.getCurrentUser()` 或 `DingdocsScript.base.getCurrentUser()` 获取当前登录用户信息，返回 `UserCellValue` 对象
- **检查激活表**：使用 `getActiveSheet()` 获取当前激活的数据表，若返回 `null` 则表示没有激活的表
- **字段去重**：在创建字段前先检查是否已存在同名字段，避免重复创建
- **写入用户值**：人员字段值为数组格式，支持通过 `userId` 或 `unionId` 指定用户
- **边栏插件架构**：边栏插件需要在 `script.ts` 中使用 `DingdocsScript.registerScript` 注册函数，然后在 `ui.tsx` 中通过 `Dingdocs.script.run` 调用