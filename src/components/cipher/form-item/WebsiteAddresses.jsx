import React from 'react';
import { useTranslation } from "react-i18next";

import {
  Input,
  Form,
  Button,
  Row,
  Col,
} from '@lockerpm/design';

import {
  PlusCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';

import global from '../../../config/global';

function WebsiteAddresses(props) {
  const { t } = useTranslation()
  const {
    form,
    className,
    disabled = false
  } = props

  const websiteAddresses = Form.useWatch('uris', form) || [];

  return (
    <div className={`website-addresses ${className}`}>
      <p className='text-black-500 mb-1'>
        {t('cipher.password.websites.title')} ({ websiteAddresses.length })
      </p>
      <Form.List
        name="uris"
      >
        {(uris, { remove }) => (
          <>
            {uris.map(({ key, name, ...restField }, index) => {
              return (
                <Row gutter={[8,8]} className='mb-2' key={key}>
                  <Col span={22}>
                    <Form.Item
                      {...restField}
                      className='mb-1'
                      name={[name, 'uri']}
                      rules={[
                        global.rules.INVALID(t('common.website_address'), 'LINK')
                      ]}
                    >
                      <Input
                        disabled={disabled}
                        placeholder={t(`placeholder.enter`)}
                      />
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
              !disabled && <Button
                type={'primary'}
                className={websiteAddresses.length === 0 ? 'mt-2' : ''}
                ghost
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  form.setFieldValue('uris', [
                    ...websiteAddresses,
                    {
                      uri: "https://"
                    }
                  ])
                }}
              >
                {t('cipher.password.websites.new')}
              </Button>
            }
          </>
        )}
      </Form.List>
    </div>
  );
}

export default WebsiteAddresses;
