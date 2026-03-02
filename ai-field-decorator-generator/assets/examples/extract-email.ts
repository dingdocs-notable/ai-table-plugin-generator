import { FieldType, fieldDecoratorKit, FormItemComponent, FieldExecuteCode } from 'dingtalk-docs-cool-app';
const { t } = fieldDecoratorKit;

fieldDecoratorKit.setDecorator({
  name: '邮箱地址提取',
  
  // 国际化配置
  i18nMap: {
    'zh-CN': {
      'sourceFieldLabel': '选择包含邮箱的文本字段',
      'sourceFieldPlaceholder': '请选择文本字段',
      'extractModeLabel': '提取模式',
      'firstEmailOption': '仅提取第一个邮箱',
      'allEmailsOption': '提取所有邮箱（逗号分隔）',
      'errorNoText': '输入文本为空',
      'errorNoEmail': '未找到邮箱地址',
    },
    'en-US': {
      'sourceFieldLabel': 'Select text field containing emails',
      'sourceFieldPlaceholder': 'Please select a text field',
      'extractModeLabel': 'Extract mode',
      'firstEmailOption': 'Extract first email only',
      'allEmailsOption': 'Extract all emails (comma separated)',
      'errorNoText': 'Input text is empty',
      'errorNoEmail': 'No email address found',
    },
    'ja-JP': {
      'sourceFieldLabel': 'メールアドレスを含むテキストフィールドを選択',
      'sourceFieldPlaceholder': 'テキストフィールドを選択してください',
      'extractModeLabel': '抽出モード',
      'firstEmailOption': '最初のメールのみ抽出',
      'allEmailsOption': 'すべてのメールを抽出（カンマ区切り）',
      'errorNoText': '入力テキストが空です',
      'errorNoEmail': 'メールアドレスが見つかりません',
    },
  },

  // 错误信息配置
  errorMessages: {
    'no_text': t('errorNoText'),
    'no_email': t('errorNoEmail'),
  },

  // UI 配置表单
  formItems: [
    {
      key: 'sourceField',
      label: t('sourceFieldLabel'),
      component: FormItemComponent.FieldSelect,
      props: {
        mode: 'single',
        supportTypes: [FieldType.Text],
        placeholder: t('sourceFieldPlaceholder'),
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'extractMode',
      label: t('extractModeLabel'),
      component: FormItemComponent.Radio,
      props: {
        defaultValue: 'first',
        options: [
          {
            value: 'first',
            label: t('firstEmailOption'),
          },
          {
            value: 'all',
            label: t('allEmailsOption'),
          }
        ]
      },
      validator: {
        required: true,
      }
    },
  ],

  // 返回结果类型：文本
  resultType: {
    type: FieldType.Text,
  },

  // 执行函数
  execute: async (context, formData: { sourceField: string; extractMode: string }) => {
    try {
      const text = formData.sourceField;
      
      // 验证输入文本
      if (!text || text.trim() === '') {
        return {
          code: FieldExecuteCode.InvalidArgument,
          data: null,
          errorMessage: 'no_text',
        };
      }

      // 邮箱正则表达式（支持常见邮箱格式）
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      
      // 提取所有邮箱地址
      const emails = text.match(emailRegex);
      
      // 如果没有找到邮箱
      if (!emails || emails.length === 0) {
        return {
          code: FieldExecuteCode.InvalidArgument,
          data: null,
          errorMessage: 'no_email',
        };
      }

      // 根据提取模式返回结果
      let result: string;
      if (formData.extractMode === 'first') {
        // 仅返回第一个邮箱
        result = emails[0];
      } else {
        // 返回所有邮箱，用逗号分隔
        // 去重处理
        const uniqueEmails = Array.from(new Set(emails));
        result = uniqueEmails.join(', ');
      }

      return {
        code: FieldExecuteCode.Success,
        data: result,
      };
    } catch (error) {
      return {
        code: FieldExecuteCode.Error,
        data: null,
        msg: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});

export default fieldDecoratorKit;