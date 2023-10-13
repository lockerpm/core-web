import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Input,
  Select,
  Form,
  Button,
  Row,
  Col,
  DatePicker
} from '@lockerpm/design';
import {
  PlusCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from '../../../../../config/global';

function CustomFields(props) {
  const { t } = useTranslation()
  const {
    form,
    className
  } = props

  const fieldTypes = global.constants.FIELD_TYPES

  const customFields = Form.useWatch('fields', form) || []

  const getFieldInfo = (type) => {
    return fieldTypes.find((t) => t.value === type)
  }

  const resetField = (type, index) => {
    const field = getFieldInfo(type)
    form.setFieldValue('fields', customFields.map((f, i) => ({
      ...f,
      type: i === index ? type : f.type,
      name: i === index ? '' : f.name,
      value: i === index ? field?.defaultValue || '' : f.value,
    })))
  }

  return (
    <div className={`custom-fields ${className}`}>
      <p className='font-semibold'>
        {t('cipher.custom_fields.title')} ({ customFields.length })
      </p>
      {
        customFields?.length > 0 && <Row gutter={[8,8]} className='mb-1'>
          <Col span={6}>
            <p className='text-gray font-semibold'>{t('common.type')}</p>
          </Col>
          <Col span={6}>
            <p className='text-gray font-semibold'>{t('common.name')}</p>
          </Col>
          <Col span={12}>
            <p className='text-gray font-semibold'>{t('common.value')}</p>
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
                      name={[name, 'type']}
                      rules={[]}
                    >
                      <Select
                        className='w-full'
                        options={fieldTypes.map((f) => ({ ...f, label: t(`cipher.custom_fields.${f.key}`) }))}
                        onChange={(v) => resetField(v, index)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...restField}
                      className='mb-1'
                      name={[name, 'name']}
                      rules={[]}
                      
                    >
                      <Input
                        placeholder={
                          field?.fieldPlaceholder ? t(`placeholder.${field?.fieldPlaceholder}`) : t(`cipher.custom_fields.${field.key}`)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      className='mb-1'
                      name={[name, 'value']}
                      rules={field.pattern ? [
                        global.rules.INVALID(t('common.value'), field.pattern)
                      ] : []}
                    >
                      {
                        field?.key === 'date' && <DatePicker
                          className='w-full'
                          format={'DD/MM/YYYY'}
                        />
                      }
                      {
                        field?.key !== 'date' && <Input
                          placeholder={t(`placeholder.${field?.placeholder || field?.key}`)}
                        />
                      }
                    </Form.Item>
                  </Col>
                  <Col span={2} align="right">
                    <Button
                      type={'text'}
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => remove(name)}
                    ></Button>
                  </Col>
                </Row>
              )
            })}
            <Button
              type={'primary'}
              className={customFields.length === 0 ? 'mt-2' : ''}
              ghost
              onClick={() => {
                form.setFieldValue('fields', [
                  ...customFields,
                  {
                    type: fieldTypes[0].value,
                    name: '',
                    value: fieldTypes[0].defaultValue || '',
                  }
                ])
              }}
              icon={<PlusCircleOutlined />}
            >
              {t('cipher.custom_fields.new')}
            </Button>
          </>
        )}
      </Form.List>
    </div>
  );
}

export default CustomFields;
