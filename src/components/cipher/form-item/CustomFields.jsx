import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Input,
  Form,
  Button,
  Row,
  Col,
  DatePicker,
  Dropdown
} from '@lockerpm/design';

import {
  PlusCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';

import commonComponents from '../../common';

import global from '../../../config/global';
import common from '../../../utils/common';

function CustomFields(props) {
  const { DisplayOtp } = commonComponents;
  const { t } = useTranslation();
  const {
    form,
    className,
    disabled = false
  } = props

  const locale = useSelector((state) => state.system.locale);

  const fieldTypes = global.constants.FIELD_TYPES

  const customFields = Form.useWatch('fields', form) || []

  const getFieldInfo = (type) => {
    return fieldTypes.find((t) => t.value === type)
  }

  const dateFormat = useMemo(() => {
    return common.datePickerFormat(locale)
  }, [locale])

  const addNewCustomField = (key) => {
    const fieldType = fieldTypes.find((f) => f.key == key) || fieldTypes[0];
    form.setFieldValue('fields', [
      ...customFields,
      {
        type: fieldType.value,
        name: t(`cipher.custom_fields.${fieldType.key}`).toString(),
        value: fieldType.defaultValue || '',
      }
    ])
  }

  return (
    <div className={`custom-fields ${className}`}>
      <p className='font-semibold'>
        {t('cipher.custom_fields.title')} ({ customFields.length })
      </p>
      {
        customFields?.length > 0 && <Row gutter={[8,8]} className='mb-1'>
          <Col span={6}>
            <p className='text-black-500 font-semibold'>{t('common.name')}</p>
          </Col>
          <Col span={12}>
            <p className='text-black-500 font-semibold'>{t('common.value')}</p>
          </Col>
        </Row>
      }
      <Form.List name="fields">
        {(fields, { remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => {
              const field = getFieldInfo(customFields[index]?.type)
              return (
                <Row gutter={[8,8]} className='mb-2' key={key}>
                  <Col span={6}>
                    <Form.Item
                      {...restField}
                      className='mb-1'
                      name={[name, 'name']}
                      rules={[]}
                      
                    >
                      <Input
                        disabled={disabled}
                        placeholder={
                          field?.fieldPlaceholder ? t(`placeholder.${field?.fieldPlaceholder}`) : t(`cipher.custom_fields.${field?.key}`)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item
                      {...restField}
                      className='mb-1'
                      name={[name, 'value']}
                      rules={field?.pattern ? [
                        global.rules.INVALID(t('common.value'), field?.pattern)
                      ] : []}
                    >
                      {
                        field?.key === 'date' && <DatePicker
                          disabled={disabled}
                          className='w-full'
                          format={dateFormat}
                        />
                      }
                      {
                        field?.key === 'hidden_field' && <Input.Password
                          disabled={disabled}
                          placeholder={t(`placeholder.${field?.placeholder || field?.key}`)}
                        />
                      }
                      {
                        field?.key === 'otp' && <Input.Password
                          disabled={disabled}
                          placeholder={t(`placeholder.${field?.placeholder || field?.key}`)}
                          addonAfter={customFields[index].value ? <DisplayOtp
                            notes={customFields[index].value}
                            className="w-[76px]"
                            codeClassName="text-md font-semibold"
                            progressSize={16}
                          /> : undefined}
                        />
                      }
                      {
                        !['date', 'hidden_field', 'otp'].includes(field?.key) && <Input
                          disabled={disabled}
                          placeholder={t(`placeholder.${field?.placeholder || field?.key}`)}
                        />
                      }
                    </Form.Item>
                  </Col>
                  <Col span={2} align="right">
                    <Button
                      type={'text'}
                      disabled={disabled}
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => remove(name)}
                    ></Button>
                  </Col>
                </Row>
              )
            })}
            {
              !disabled && <Dropdown
                menu={{
                  items: fieldTypes.map((f) => ({ key: f.key, label: t(`cipher.custom_fields.${f.key}`) })),
                  onClick: ({ key }) => addNewCustomField(key)
                }}
                trigger={['click']}
              >
                <Button
                  type={'primary'}
                  className={customFields.length === 0 ? 'mt-2' : ''}
                  ghost
                  icon={<PlusCircleOutlined />}
                >
                  {t('cipher.custom_fields.new')}
                </Button>
              </Dropdown>
            }
          </>
        )}
      </Form.List>
    </div>
  );
}

export default CustomFields;
