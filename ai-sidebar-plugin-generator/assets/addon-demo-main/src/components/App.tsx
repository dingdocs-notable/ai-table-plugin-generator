/*global Dingdocs*/

import { useEffect, useState, useCallback } from 'react';
import { initView } from 'dingtalk-docs-cool-app';
import { Typography, Button, Collapse, Card } from 'dingtalk-design-desktop';
import { getLocale, type Locales } from './locales';
import './style.css';

interface Sheet {
  id: string;
  name: string;
  desc: string;
  fieldsCount: number;
}

interface Field {
  id: string;
  name: string;
  type: string;
  isPrimary: boolean;
}

interface Record {
  id: string;
  fields: {[key: string]: any};
}

interface DocumentInfo {
  uuid: string;
  sheetsCount: number;
  currentSheet: string;
}

function App() {
  const [locale, setLocale] = useState<Locales>(getLocale('zh-CN'));
  const [loading, setLoading] = useState<boolean>(false);
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [activeSheet, setActiveSheet] = useState<Sheet | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [records, setRecords] = useState<Record[]>([]);

  // 存储事件监听器的取消函数
  const [eventUnsubscribers, setEventUnsubscribers] = useState<Array<() => void>>([]);

  // 获取主键字段名称，如果没有主键则返回第一个字段名称
  const getPrimaryFieldName = (): string => {
    if (fields.length === 0) return 'ID';
    
    // 查找主键字段
    const primaryField = fields.find(field => field.isPrimary);
    if (primaryField) {
      return primaryField.name;
    }
    
    // 如果没有主键，返回第一个字段
    return fields[0].name;
  };

  // 获取记录的主要显示值
  const getRecordDisplayValue = (record: Record, maxLength: number = 50): string => {
    const primaryFieldName = getPrimaryFieldName();
    const value = record.fields[primaryFieldName];
    
    if (value === null || value === undefined || value === '') {
      return locale.untitled;
    }
    
    let displayValue: string;
    
    // 如果是对象类型的值，尝试提取文本
    if (typeof value === 'object' && value !== null) {
      displayValue = value.text || value.name || JSON.stringify(value);
    } else {
      displayValue = String(value);
    }
    
    // 限制最大长度
    if (displayValue.length > maxLength) {
      return displayValue.substring(0, maxLength) + '...';
    }
    
    return displayValue;
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadDocumentInfo(),
          loadSheets(),
          loadActiveSheet()
        ]);
      } catch (error: any) {
        console.error(`${locale.operationFailed}: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    // 初始化鉴权
    const initConfigPermission = async () => {
      try {
        // 获取当前页面的URL
        const currentUrl = window.location.href;
        console.log('Current URL for config permission:', currentUrl);

        // 从后端服务器请求钉钉配置权限
        const response = await fetch(`/api/configPermission?url=${encodeURIComponent(currentUrl)}`);
        if (!response.ok) {
          throw new Error(`请求失败: ${response.status} ${response.statusText}`);
        }

        const configData = await response.json();
        console.log('Received config permission data:', configData);

        // 调用钉钉配置方法
        await Dingdocs.base.host.configPermission(
          configData.agentId,
          configData.corpId,
          configData.timeStamp,
          configData.nonceStr,
          configData.signature,
          configData.jsApiList || ["DingdocsScript.base.readWriteAll"],
        );

        console.log('Config permission set successfully');
      } catch (error) {
        console.error('Config permission error:', error);
        // 保留之前的错误信息，但更友好地处理
        console.warn('Config permission failed - this may affect some functionality');
      }
    };

    let unsubscribers: Array<() => void> = [];
    let lastSheetId: string | null = null; // 记录上次的sheetId，避免重复触发
    let debounceTimer: NodeJS.Timeout | null = null; // 防抖定时器

    const setupEvents = () => {
      try {
        // 监听选择变化（包括activeSheet变化）
        const offSelectionChanged = Dingdocs.base.event.onSelectionChanged((selection) => {
          // 只有当sheetId真正变化时才更新状态
          if (selection.sheetId && selection.sheetId !== lastSheetId) {
            lastSheetId = selection.sheetId;
            console.log('Active sheet changed to:', selection.sheetId);

            // 使用防抖来避免频繁调用
            if (debounceTimer) {
              clearTimeout(debounceTimer);
            }
            debounceTimer = setTimeout(() => {
              loadActiveSheet();
              loadDocumentInfo(); // 更新文档信息，包括当前表名
            }, 300); // 300ms防抖延迟
          }
        });
        unsubscribers.push(offSelectionChanged);

        // 监听数据表添加事件
        const offSheetInserted = Dingdocs.base.event.onSheetInserted((event) => {
          console.log('Sheet inserted:', event);
          loadSheets();
          loadDocumentInfo();
        });
        unsubscribers.push(offSheetInserted);

        // 监听数据表删除事件
        const offSheetDeleted = Dingdocs.base.event.onSheetDeleted((event) => {
          console.log('Sheet deleted:', event);
          loadSheets();
          loadDocumentInfo();
          // 如果删除的是当前激活的表，重新加载当前表
          loadActiveSheet();
        });
        unsubscribers.push(offSheetDeleted);

        // 监听字段添加事件
        const offFieldInserted = Dingdocs.base.event.onFieldInserted((event) => {
          console.log('Field inserted:', event);
          // 如果是当前表的字段变化，重新加载字段列表
          if (!activeSheet || event.sheetId === activeSheet.id) {
            loadFields();
          }
          loadSheets(); // 更新字段数量
        });
        unsubscribers.push(offFieldInserted);

        // 监听字段修改事件
        const offFieldModified = Dingdocs.base.event.onFieldModified((event) => {
          console.log('Field modified:', event);
          if (!activeSheet || event.sheetId === activeSheet.id) {
            loadFields();
          }
        });
        unsubscribers.push(offFieldModified);

        // 监听字段删除事件
        const offFieldDeleted = Dingdocs.base.event.onFieldDeleted((event) => {
          console.log('Field deleted:', event);
          if (!activeSheet || event.sheetId === activeSheet.id) {
            loadFields();
          }
          loadSheets(); // 更新字段数量
        });
        unsubscribers.push(offFieldDeleted);

        // 监听记录添加事件
        const offRecordInserted = Dingdocs.base.event.onRecordInserted((event) => {
          console.log('Record inserted:', event);
          if (!activeSheet || event.sheetId === activeSheet.id) {
            loadRecords();
          }
        });
        unsubscribers.push(offRecordInserted);

        // 监听记录修改事件
        const offRecordModified = Dingdocs.base.event.onRecordModified((event) => {
          console.log('Record modified:', event);
          if (!activeSheet || event.sheetId === activeSheet.id) {
            loadRecords();
          }
        });
        unsubscribers.push(offRecordModified);

        // 监听记录删除事件
        const offRecordDeleted = Dingdocs.base.event.onRecordDeleted((event) => {
          console.log('Record deleted:', event);
          if (!activeSheet || event.sheetId === activeSheet.id) {
            loadRecords();
          }
        });
        unsubscribers.push(offRecordDeleted);

        // 保存所有取消监听的函数
        setEventUnsubscribers(unsubscribers);

        console.log('Event listeners setup completed');
      } catch (error: any) {
        console.error('Failed to setup event listeners:', error);
      }
    };

    initView({
      onReady: async () => {
        // 获取当前语言设置
        try {
          const currentLocale = await Dingdocs.base.host.getLocale();
          setLocale(getLocale(currentLocale));
        } catch (e) {
          console.warn('Failed to get locale, using default zh-CN');
        }
        // 初始化插件鉴权(公开发布企业内插件/三方企业插件场景下需要解除下方注释进行鉴权)
        // await initConfigPermission();

        // 初始化数据
        await initialize();

        // 设置事件监听
        setupEvents();
      },
    });

    // 清理函数
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      unsubscribers.forEach(unsubscribe => {
        try {
          unsubscribe();
        } catch (error) {
          console.warn('Failed to unsubscribe event listener:', error);
        }
      });
    };
  }, []); // 这里故意只在组件挂载时运行一次

  // 清理事件监听器
  useEffect(() => {
    return () => {
      eventUnsubscribers.forEach(unsubscribe => {
        try {
          unsubscribe();
        } catch (error) {
          console.warn('Failed to unsubscribe event listener:', error);
        }
      });
    };
  }, [eventUnsubscribers]);

  // 加载文档信息
  const loadDocumentInfo = useCallback(async () => {
    try {
      const info = await Dingdocs.script.run('getDocumentInfo');
      setDocumentInfo(info);
    } catch (error: any) {
      console.error('Load document info failed:', error);
    }
  }, []);

  // 加载数据表列表
  const loadSheets = useCallback(async () => {
    try {
      const sheetList = await Dingdocs.script.run('getAllSheets');
      setSheets(sheetList);
    } catch (error: any) {
      console.error('Load sheets failed:', error);
    }
  }, []);

  // 加载字段列表
  const loadFields = useCallback(async (sheetId?: string) => {
    try {
      const fieldList = await Dingdocs.script.run('getSheetFields', sheetId);
      setFields(fieldList);
    } catch (error: any) {
      console.error('Load fields failed:', error);
    }
  }, []);

  // 加载当前激活的数据表
  const loadActiveSheet = useCallback(async () => {
    try {
      const sheet = await Dingdocs.script.run('getActiveSheet');
      setActiveSheet(sheet);
      if (sheet) {
        await loadFields(sheet.id);
      }
    } catch (error: any) {
      console.error('Load active sheet failed:', error);
    }
  }, [loadFields]);

  // 加载记录列表
  const loadRecords = useCallback(async (sheetId?: string) => {
    try {
      const recordData = await Dingdocs.script.run('getRecords', sheetId);
      console.log('Loaded records:', recordData);
      setRecords(recordData.records);
    } catch (error: any) {
      console.error('Load records failed:', error);
    }
  }, []);

  // 创建数据表
  const handleCreateSheet = async () => {
    const name = prompt(locale.enterSheetName);
    if (!name || !name.trim()) {
      return;
    }

    try {
      await Dingdocs.script.run('createSheet', name.trim());
      console.log(`✅ ${locale.createSheetSuccess}`);
      await loadSheets();
    } catch (error: any) {
      alert(`${locale.operationFailed}: ${error.message}`);
    }
  };

  // 删除数据表
  const handleDeleteSheet = async (sheetId: string, sheetName: string) => {
    if (!window.confirm(`${locale.confirmDelete}: ${sheetName}?`)) {
      return;
    }

    try {
      await Dingdocs.script.run('deleteSheet', sheetId);
      console.log(`✅ ${locale.deleteSheetSuccess}`);
      await loadSheets();
      if (activeSheet?.id === sheetId) {
        await loadActiveSheet();
      }
    } catch (error: any) {
      alert(`${locale.operationFailed}: ${error.message}`);
    }
  };

  // 添加字段
  const handleAddField = async () => {
    const name = prompt(locale.enterFieldName);
    if (!name || !name.trim()) {
      return;
    }

    setLoading(true);
    try {
      await Dingdocs.script.run('addField', name.trim(), 'text');
      console.log(`✅ ${locale.addFieldSuccess}`);
      await loadFields();
    } catch (error: any) {
      alert(`${locale.operationFailed}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 删除字段
  const handleDeleteField = async (fieldId: string, fieldName: string, isPrimary: boolean) => {
    if (isPrimary) {
      alert(locale.cannotDeletePrimaryKeyField);
      return;
    }

    if (!window.confirm(`${locale.confirmDeleteField} "${fieldName}" ${locale.confirmDelete}？${locale.dataWillBeLost}。`)) {
      return;
    }

    try {
      await Dingdocs.script.run('deleteField', fieldId);
      console.log(`✅ ${locale.deleteFieldSuccess}`);
      await loadFields();
    } catch (error: any) {
      alert(`${locale.deleteFieldFailed}: ${error.message}`);
    }
  };

  // 添加记录
  const handleAddRecord = async () => {
    const title = prompt(locale.enterRecordTitle);
    if (!title || !title.trim()) {
      return;
    }

    try {
      const primaryFieldName = getPrimaryFieldName();
      const recordFields: {[key: string]: any} = {
        [primaryFieldName]: title.trim()
      };
      
      await Dingdocs.script.run('addRecord', recordFields);
      console.log(`✅ ${locale.addRecordSuccess}`);
      await loadRecords();
    } catch (error: any) {
      alert(`${locale.operationFailed}: ${error.message}`);
    }
  };

  // 删除记录
  const handleDeleteRecord = async (recordId: string) => {
    if (!window.confirm(locale.confirmDelete)) {
      return;
    }
    try {
      await Dingdocs.script.run('deleteRecord', recordId);
      console.log(`✅ ${locale.deleteRecordSuccess}`);
      await loadRecords();
    } catch (error: any) {
      alert(`${locale.operationFailed}: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className='page'>
        <div className='loading'>
          <Typography.Text>{locale.loading}</Typography.Text>
        </div>
      </div>
    );
  }

  return (
    <div className='page'>
      <div className='header'>
        <Typography.Text strong>{locale.title}</Typography.Text>
      </div>
      <div className='content'>
        <Collapse expandIconPosition={'right'} defaultActiveKey={['document-info', 'sheet-management']}>
          <Collapse.Panel header={locale.documentInfo} key="document-info">
            <Card size={'small'} title={locale.documentInfo}>
              {documentInfo && (
                <div>
                  <div className="info-item">
                    <Typography.Text><strong>{locale.documentUuid}:</strong> {documentInfo.uuid}</Typography.Text>
                  </div>
                  <div className="info-item">
                    <Typography.Text><strong>{locale.totalSheets}:</strong> {documentInfo.sheetsCount}</Typography.Text>
                  </div>
                  <div className="info-item">
                    <Typography.Text><strong>{locale.currentSheet}:</strong> {documentInfo.currentSheet}</Typography.Text>
                  </div>
                </div>
              )}
            </Card>
          </Collapse.Panel>
          <Collapse.Panel header={locale.sheetManagement} key="sheet-management">
            <Card 
              size={'small'}
              title={locale.sheetManagement}
              extra={
                <Button type="primary" size={'small'} onClick={handleCreateSheet}>
                  {locale.createSheet}
                </Button>
              }
            >
              <Typography.Text type={'secondary'}>
                {locale.sheetManagementDescription} - {sheets.length} {locale.sheetsUnit}
              </Typography.Text>
              <div className="line"/>
              <div className="table-container">
                {sheets.map((sheet) => (
                  <Card key={sheet.id} size={'small'} style={{marginBottom: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <Typography.Text strong>{sheet.name}</Typography.Text>
                        {activeSheet?.id === sheet.id && <span style={{color: '#1890ff', marginLeft: '8px'}}>[{locale.currentTable}]</span>}
                        <br/>
                        <Typography.Text type={'secondary'}>
                          {locale.fieldsCount}: {sheet.fieldsCount}
                        </Typography.Text>
                      </div>
                      <div style={{display: 'flex', gap: '8px'}}>
                        <Button size={'small'} onClick={() => loadFields(sheet.id)}>
                          {locale.viewFields}
                        </Button>
                        <Button size={'small'} onClick={() => loadRecords(sheet.id)}>
                          {locale.viewRecords}
                        </Button>
                        {sheets.length > 1 && (
                          <Button 
                            size={'small'} 
                            danger 
                            onClick={() => handleDeleteSheet(sheet.id, sheet.name)}
                          >
                            {locale.delete}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
            <div className="line"/>

            <Card 
              size={'small'}
              title={locale.fieldManagement}
              extra={
                <Button type="primary" size={'small'} onClick={handleAddField}>
                  {locale.addField}
                </Button>
              }
            >
              <Typography.Text type={'secondary'}>
                {locale.fieldManagementDescription} - {fields.length} {locale.fieldsUnit}
              </Typography.Text>
              <div className="line"/>
              <div className="table-container">
                {fields.map((field) => (
                  <Card key={field.id} size={'small'} style={{marginBottom: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <Typography.Text strong>{field.name}</Typography.Text>
                        {field.isPrimary && <span style={{color: '#faad14', marginLeft: '8px'}}>[{locale.primaryKey}]</span>}
                        <br/>
                        <Typography.Text type={'secondary'}>
                          {locale.fieldType}: {field.type}
                        </Typography.Text>
                      </div>
                      <div>
                        {!field.isPrimary && (
                          <Button 
                            size={'small'} 
                            danger 
                            onClick={() => handleDeleteField(field.id, field.name, field.isPrimary)}
                          >
                            {locale.delete}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
            <div className="line"/>

            <Card 
              size={'small'}
              title={locale.recordManagement}
              extra={
                <Button type="primary" size={'small'} onClick={handleAddRecord}>
                  {locale.addRecord}
                </Button>
              }
            >
              <Typography.Text type={'secondary'}>
                {locale.recordManagementDescription} - {records.length} {locale.recordsUnit}
              </Typography.Text>
              <div className="line"/>
              <div className="table-container">
                {records.map((record) => (
                  <Card key={record.id} size={'small'} style={{marginBottom: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <Typography.Text strong>
                          {getRecordDisplayValue(record)}
                        </Typography.Text>
                        <br/>
                        <Typography.Text type={'secondary'}>
                          {locale.recordId}: {record.id}
                        </Typography.Text>
                        <br/>
                        <Typography.Text type={'secondary'}>
                          {locale.fieldsCount}: {Object.keys(record.fields).length}
                        </Typography.Text>
                      </div>
                      <div>
                        <Button 
                          size={'small'} 
                          danger 
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          {locale.delete}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
}

export default App;
