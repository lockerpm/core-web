import React from 'react';
import { useTranslation } from "react-i18next";

import {
  Input,
  Button,
  Row,
  Col,
} from '@lockerpm/design';

import {
  CloseOutlined
} from '@ant-design/icons';

import common from '../../../utils/common';

function Fido2Credentials(props) {
  const { t } = useTranslation()
  const {
    className,
    disabled = false,
    fido2Credentials,
    setFido2Credentials = () => {},
  } = props

  return (
    <div className={`fido2-credentials ${className}`}>
      <p className='text-black-500 mb-1'>
        {t('cipher.password.passkey')}
      </p>
      {
        fido2Credentials.map((item, index) => {
          return (
            <Row gutter={[8,8]} className='mb-2' key={index}>
              <Col span={22}>
                <Input
                  value={`${t('common.created')}: ${common.convertDateTime(item.creationDate)}`}
                  disabled={true}
                  placeholder={t(`placeholder.enter`)}
                />
              </Col>
              <Col span={2} align="right">
                <Button
                  type={'text'}
                  disabled={disabled}
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => setFido2Credentials(fido2Credentials.filter((_, i) => i !== index))}
                ></Button>
              </Col>
            </Row>
          )
        })
      }
    </div>
  );
}

export default Fido2Credentials;
