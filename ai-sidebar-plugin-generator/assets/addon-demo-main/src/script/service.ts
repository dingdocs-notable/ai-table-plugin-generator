/*global DingdocsScript*/
import type {} from 'dingtalk-docs-cool-app';

/**
 * AI表格边栏插件服务层
 * 运行在 Web Worker 中，提供AI表格操作的核心功能
 */

// 获取当前激活的数据表
function getActiveSheet() {
  try {
    const base = DingdocsScript.base;
    const sheet = base.getActiveSheet();
    if (!sheet) {
      throw new Error('未找到激活的数据表');
    }
    return {
      id: sheet.getId(),
      name: sheet.getName(),
      desc: sheet.getDesc() || '',
      fieldsCount: sheet.getFields().length
    };
  } catch (error: any) {
    throw new Error(`获取激活数据表失败: ${error.message}`);
  }
}

// 获取所有数据表列表
function getAllSheets() {
  try {
    const base = DingdocsScript.base;
    const sheets = base.getSheets();
    return sheets.map((sheet: any) => ({
      id: sheet.getId(),
      name: sheet.getName(),
      desc: sheet.getDesc() || '',
      fieldsCount: sheet.getFields().length
    }));
  } catch (error: any) {
    throw new Error(`获取数据表列表失败: ${error.message}`);
  }
}

// 创建新的数据表
function createSheet(name: string) {
  try {
    if (!name || name.trim() === '') {
      throw new Error('数据表名称不能为空');
    }
    
    const base = DingdocsScript.base;
    // 创建带有基本字段的数据表
    const sheet = base.insertSheet(name.trim(), [
      { name: '标题', type: 'text' },
      { name: '状态', type: 'singleSelect' },
      { name: '创建时间', type: 'date' }
    ]);
    
    return {
      id: sheet.getId(),
      name: sheet.getName(),
      desc: sheet.getDesc() || '',
      fieldsCount: sheet.getFields().length
    };
  } catch (error: any) {
    throw new Error(`创建数据表失败: ${error.message}`);
  }
}

// 删除数据表
function deleteSheet(sheetId: string) {
  try {
    if (!sheetId) {
      throw new Error('数据表ID不能为空');
    }
    console.log('sheetId', sheetId);
    const base = DingdocsScript.base;
    base.deleteSheet(sheetId);
    return { success: true };
  } catch (error: any) {
    throw new Error(`删除数据表失败: ${error.message}`);
  }
}

// 获取数据表字段信息
function getSheetFields(sheetId?: string) {
  try {
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    const fields = sheet.getFields();
    return fields.map((field: any) => ({
      id: field.getId(),
      name: field.getName(),
      type: field.getType(),
      isPrimary: field.isPrimary?.() || false,
    }));
  } catch (error: any) {
    throw new Error(`获取字段信息失败: ${error.message}`);
  }
}

// 添加字段
function addField(name: string, type: string, sheetId?: string) {
  try {
    if (!name || name.trim() === '') {
      throw new Error('字段名称不能为空');
    }
    
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    const field = sheet.insertField({
      name: name.trim(),
      type: type as any
    });
    
    return {
      id: field.getId(),
      name: field.getName(),
      type: field.getType(),
      isPrimary: field.isPrimary?.() || false
    };
  } catch (error: any) {
    throw new Error(`添加字段失败: ${error.message}`);
  }
}

// 删除字段
function deleteField(fieldId: string, sheetId?: string) {
  try {
    if (!fieldId) {
      throw new Error('字段ID不能为空');
    }
    
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    // 检查是否为主键字段
    const field = sheet.getField(fieldId);
    if (field && field.isPrimary?.()) {
      throw new Error('不能删除主键字段');
    }
    
    sheet.deleteField(fieldId);
    return { success: true };
  } catch (error: any) {
    throw new Error(`删除字段失败: ${error.message}`);
  }
}

// 获取记录数据
async function getRecords(sheetId?: string, pageSize = 20) {
  try {
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    const result = await sheet.getRecordsAsync({ pageSize });
    
    return {
      records: result.records.map((record: any) => ({
        id: record.getId(),
        fields: record.getCellValues()
      })),
      hasMore: result.hasMore,
      cursor: result.cursor,
      total: result.records.length
    };
  } catch (error: any) {
    throw new Error(`获取记录失败: ${error.message}`);
  }
}

// 添加记录
async function addRecord(fields: Record<string, any>, sheetId?: string) {
  try {
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    const records = await sheet.insertRecordsAsync([{ fields }]);
    const record = records[0];
    
    return {
      id: record.getId(),
      fields: record.getCellValues()
    };
  } catch (error: any) {
    throw new Error(`添加记录失败: ${error.message}`);
  }
}

// 更新记录
async function updateRecord(recordId: string, fields: Record<string, any>, sheetId?: string) {
  try {
    if (!recordId) {
      throw new Error('记录ID不能为空');
    }
    
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    const records = await sheet.updateRecordsAsync([{ id: recordId, fields }]);
    const record = records[0];
    
    return {
      id: record.getId(),
      fields: record.getCellValues()
    };
  } catch (error: any) {
    throw new Error(`更新记录失败: ${error.message}`);
  }
}

// 删除记录
async function deleteRecord(recordId: string, sheetId?: string) {
  try {
    if (!recordId) {
      throw new Error('记录ID不能为空');
    }
    
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    await sheet.deleteRecordsAsync([recordId]);
    return { success: true };
  } catch (error: any) {
    throw new Error(`删除记录失败: ${error.message}`);
  }
}

// 获取文档信息
function getDocumentInfo() {
  try {
    const base = DingdocsScript.base;
    const uuid = base.getDentryUuid();
    const sheets = base.getSheets();
    
    return {
      uuid,
      sheetsCount: sheets.length,
      currentSheet: base.getActiveSheet()?.getName() || '无'
    };
  } catch (error: any) {
    throw new Error(`获取文档信息失败: ${error.message}`);
  }
}

// 注册所有方法供UI层调用
DingdocsScript.registerScript('getActiveSheet', getActiveSheet);
DingdocsScript.registerScript('getAllSheets', getAllSheets);
DingdocsScript.registerScript('createSheet', createSheet);
DingdocsScript.registerScript('deleteSheet', deleteSheet);
DingdocsScript.registerScript('getSheetFields', getSheetFields);
DingdocsScript.registerScript('addField', addField);
DingdocsScript.registerScript('deleteField', deleteField);
DingdocsScript.registerScript('getRecords', getRecords);
DingdocsScript.registerScript('addRecord', addRecord);
DingdocsScript.registerScript('updateRecord', updateRecord);
DingdocsScript.registerScript('deleteRecord', deleteRecord);
DingdocsScript.registerScript('getDocumentInfo', getDocumentInfo);

export {};
