/**
 * AI表格边栏插件国际化文案
 */

export interface Locales {
  title: string;
  documentInfo: string;
  sheetManagement: string;
  fieldManagement: string;
  recordManagement: string;
  currentSheet: string;
  sheetName: string;
  fieldsCount: string;
  recordsCount: string;
  createSheet: string;
  deleteSheet: string;
  refreshSheets: string;
  addField: string;
  viewFields: string;
  addRecord: string;
  viewRecords: string;
  fieldName: string;
  fieldType: string;
  recordTitle: string;
  status: string;
  createTime: string;
  operation: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  loading: string;
  noData: string;
  confirmDelete: string;
  enterSheetName: string;
  enterFieldName: string;
  selectFieldType: string;
  enterRecordTitle: string;
  selectStatus: string;
  success: string;
  error: string;
  text: string;
  number: string;
  date: string;
  singleSelect: string;
  multiSelect: string;
  attachment: string;
  link: string;
  currency: string;
  pending: string;
  inProgress: string;
  completed: string;
  cancelled: string;
  createSheetSuccess: string;
  deleteSheetSuccess: string;
  addFieldSuccess: string;
  addRecordSuccess: string;
  updateRecordSuccess: string;
  deleteRecordSuccess: string;
  operationFailed: string;
  pleaseSelectSheet: string;
  cannotDeleteLastSheet: string;
  cannotDeletePrimaryField: string;
  documentUuid: string;
  totalSheets: string;
  untitled: string;
  sheetManagementDescription: string;
  fieldManagementDescription: string;
  recordManagementDescription: string;
  currentTable: string;
  primaryKey: string;
  recordId: string;
  cannotDeletePrimaryKeyField: string;
  confirmDeleteField: string;
  deleteFieldSuccess: string;
  deleteFieldFailed: string;
  dataWillBeLost: string;
  sheetsUnit: string;
  fieldsUnit: string;
  recordsUnit: string;
}

export const locales: Record<string, Locales> = {
  'zh-CN': {
    title: 'AI表格管理助手',
    documentInfo: '文档信息',
    sheetManagement: '数据表管理',
    fieldManagement: '字段管理',
    recordManagement: '记录管理',
    currentSheet: '当前数据表',
    sheetName: '数据表名称',
    fieldsCount: '字段数量',
    recordsCount: '记录数量',
    createSheet: '创建数据表',
    deleteSheet: '删除数据表',
    refreshSheets: '刷新列表',
    addField: '添加字段',
    viewFields: '查看字段',
    addRecord: '添加记录',
    viewRecords: '查看记录',
    fieldName: '字段名称',
    fieldType: '字段类型',
    recordTitle: '记录标题',
    status: '状态',
    createTime: '创建时间',
    operation: '操作',
    edit: '编辑',
    delete: '删除',
    save: '保存',
    cancel: '取消',
    loading: '加载中...',
    noData: '暂无数据',
    confirmDelete: '确认删除',
    enterSheetName: '请输入数据表名称',
    enterFieldName: '请输入字段名称',
    selectFieldType: '请选择字段类型',
    enterRecordTitle: '请输入记录标题',
    selectStatus: '请选择状态',
    success: '成功',
    error: '错误',
    text: '文本',
    number: '数字',
    date: '日期',
    singleSelect: '单选',
    multiSelect: '多选',
    attachment: '附件',
    link: '链接',
    currency: '货币',
    pending: '待处理',
    inProgress: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    createSheetSuccess: '数据表创建成功',
    deleteSheetSuccess: '数据表删除成功',
    addFieldSuccess: '字段添加成功',
    addRecordSuccess: '记录添加成功',
    updateRecordSuccess: '记录更新成功',
    deleteRecordSuccess: '记录删除成功',
    operationFailed: '操作失败',
    pleaseSelectSheet: '请选择数据表',
    cannotDeleteLastSheet: '不能删除最后一张数据表',
    cannotDeletePrimaryField: '不能删除主键字段',
    documentUuid: '文档UUID',
    totalSheets: '数据表总数',
    untitled: '无标题',
    sheetManagementDescription: '数据表管理',
    fieldManagementDescription: '字段管理',
    recordManagementDescription: '记录管理',
    currentTable: '当前表',
    primaryKey: '主键',
    recordId: '记录ID',
    cannotDeletePrimaryKeyField: '不能删除主键字段',
    confirmDeleteField: '确定要删除字段',
    deleteFieldSuccess: '删除字段成功',
    deleteFieldFailed: '删除字段失败',
    dataWillBeLost: '删除后该字段的所有数据将丢失',
    sheetsUnit: '张表',
    fieldsUnit: '个字段',
    recordsUnit: '条记录'
  },
  'en-US': {
    title: 'Multi-table Management Assistant',
    documentInfo: 'Document Info',
    sheetManagement: 'Sheet Management',
    fieldManagement: 'Field Management',
    recordManagement: 'Record Management',
    currentSheet: 'Current Sheet',
    sheetName: 'Sheet Name',
    fieldsCount: 'Fields Count',
    recordsCount: 'Records Count',
    createSheet: 'Create Sheet',
    deleteSheet: 'Delete Sheet',
    refreshSheets: 'Refresh List',
    addField: 'Add Field',
    viewFields: 'View Fields',
    addRecord: 'Add Record',
    viewRecords: 'View Records',
    fieldName: 'Field Name',
    fieldType: 'Field Type',
    recordTitle: 'Record Title',
    status: 'Status',
    createTime: 'Create Time',
    operation: 'Operation',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    noData: 'No Data',
    confirmDelete: 'Confirm Delete',
    enterSheetName: 'Enter sheet name',
    enterFieldName: 'Enter field name',
    selectFieldType: 'Select field type',
    enterRecordTitle: 'Enter record title',
    selectStatus: 'Select status',
    success: 'Success',
    error: 'Error',
    text: 'Text',
    number: 'Number',
    date: 'Date',
    singleSelect: 'Single Select',
    multiSelect: 'Multi Select',
    attachment: 'Attachment',
    link: 'Link',
    currency: 'Currency',
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    createSheetSuccess: 'Sheet created successfully',
    deleteSheetSuccess: 'Sheet deleted successfully',
    addFieldSuccess: 'Field added successfully',
    addRecordSuccess: 'Record added successfully',
    updateRecordSuccess: 'Record updated successfully',
    deleteRecordSuccess: 'Record deleted successfully',
    operationFailed: 'Operation failed',
    pleaseSelectSheet: 'Please select a sheet',
    cannotDeleteLastSheet: 'Cannot delete the last sheet',
    cannotDeletePrimaryField: 'Cannot delete primary field',
    documentUuid: 'Document UUID',
    totalSheets: 'Total Sheets',
    untitled: 'Untitled',
    sheetManagementDescription: 'Sheet Management',
    fieldManagementDescription: 'Field Management',
    recordManagementDescription: 'Record Management',
    currentTable: 'Current Table',
    primaryKey: 'Primary Key',
    recordId: 'Record ID',
    cannotDeletePrimaryKeyField: 'Cannot delete primary key field',
    confirmDeleteField: 'Are you sure to delete field',
    deleteFieldSuccess: 'Field deleted successfully',
    deleteFieldFailed: 'Failed to delete field',
    dataWillBeLost: 'All data in this field will be lost after deletion',
    sheetsUnit: 'sheets',
    fieldsUnit: 'fields',
    recordsUnit: 'records'
  },
  'ja-JP': {
    title: 'マルチテーブル管理アシスタント',
    documentInfo: 'ドキュメント情報',
    sheetManagement: 'シート管理',
    fieldManagement: 'フィールド管理',
    recordManagement: 'レコード管理',
    currentSheet: '現在のシート',
    sheetName: 'シート名',
    fieldsCount: 'フィールド数',
    recordsCount: 'レコード数',
    createSheet: 'シート作成',
    deleteSheet: 'シート削除',
    refreshSheets: 'リスト更新',
    addField: 'フィールド追加',
    viewFields: 'フィールド表示',
    addRecord: 'レコード追加',
    viewRecords: 'レコード表示',
    fieldName: 'フィールド名',
    fieldType: 'フィールドタイプ',
    recordTitle: 'レコードタイトル',
    status: 'ステータス',
    createTime: '作成時間',
    operation: '操作',
    edit: '編集',
    delete: '削除',
    save: '保存',
    cancel: 'キャンセル',
    loading: '読み込み中...',
    noData: 'データなし',
    confirmDelete: '削除確認',
    enterSheetName: 'シート名を入力してください',
    enterFieldName: 'フィールド名を入力してください',
    selectFieldType: 'フィールドタイプを選択してください',
    enterRecordTitle: 'レコードタイトルを入力してください',
    selectStatus: 'ステータスを選択してください',
    success: '成功',
    error: 'エラー',
    text: 'テキスト',
    number: '数値',
    date: '日付',
    singleSelect: '単一選択',
    multiSelect: '複数選択',
    attachment: '添付ファイル',
    link: 'リンク',
    currency: '通貨',
    pending: '保留中',
    inProgress: '進行中',
    completed: '完了',
    cancelled: 'キャンセル済み',
    createSheetSuccess: 'シートが正常に作成されました',
    deleteSheetSuccess: 'シートが正常に削除されました',
    addFieldSuccess: 'フィールドが正常に追加されました',
    addRecordSuccess: 'レコードが正常に追加されました',
    updateRecordSuccess: 'レコードが正常に更新されました',
    deleteRecordSuccess: 'レコードが正常に削除されました',
    operationFailed: '操作に失敗しました',
    pleaseSelectSheet: 'シートを選択してください',
    cannotDeleteLastSheet: '最後のシートは削除できません',
    cannotDeletePrimaryField: 'プライマリフィールドは削除できません',
    documentUuid: 'ドキュメントUUID',
    totalSheets: 'シート総数',
    untitled: '無題',
    sheetManagementDescription: 'シート管理',
    fieldManagementDescription: 'フィールド管理',
    recordManagementDescription: 'レコード管理',
    currentTable: '現在のテーブル',
    primaryKey: 'プライマリキー',
    recordId: 'レコードID',
    cannotDeletePrimaryKeyField: 'プライマリキーフィールドは削除できません',
    confirmDeleteField: 'フィールドを削除してもよろしいですか',
    deleteFieldSuccess: 'フィールドの削除に成功しました',
    deleteFieldFailed: 'フィールドの削除に失敗しました',
    dataWillBeLost: '削除後、このフィールドのすべてのデータが失われます',
    sheetsUnit: 'シート',
    fieldsUnit: 'フィールド',
    recordsUnit: 'レコード'
  }
};

export function getLocale(locale: string): Locales {
  return locales[locale] || locales['zh-CN'];
}
