import { FieldType, fieldDecoratorKit, FormItemComponent, FieldExecuteCode } from 'dingtalk-docs-cool-app';
const { t } = fieldDecoratorKit;

// 通过addDomainList添加请求接口的域名
fieldDecoratorKit.setDomainList(['aistudio.alibaba-inc.com']);

fieldDecoratorKit.setDecorator({
  name: 'FaaS字段模板 - demo',
  // 定义捷径的i18n语言资源
  i18nMap: {
    'zh-CN': {
      'demoTextarea': '文本示例',
      'demoSingleSelect': '单选示例',
      'demoMultiSelect': '多选示例',
      'demoRadio': '单选框示例',
      'demoFieldSelect': '字段选择示例'
    },
    'en-US': {
    },
    'ja-JP': {
    },
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'demoTextarea',
      label: t('demoTextarea'),
      component: FormItemComponent.Textarea,
      props: {
        placeholder: '请输入',
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'demoSingleSelect',
      label: t('demoSingleSelect'),
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
    {
      key: 'demoMultiSelect',
      label: t('demoMultiSelect'),
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
    {
      key: 'demoRadio',
      label: t('demoRadio'),
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
    {
      key: 'demoFieldSelect',
      label: t('demoFieldSelect'),
      component: FormItemComponent.FieldSelect,
      props: {
        mode: 'single',
        supportTypes: [
          FieldType.Link,
        ],
      },
      validator: {
        required: true,
      }
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Text,
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (
    context,
    formData: {
      demoTextarea: string;
      demoSingleSelect: string;
      demoMultiSelect: string[];
      demoRadio: string;
      demoFieldSelect: { url: string; text: string }
    }
  ) => {
    return {
      code: FieldExecuteCode.Success,
      data: 'success',
    };
  },
});
export default fieldDecoratorKit;
