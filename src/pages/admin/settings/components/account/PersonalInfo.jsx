import React, { } from "react";
import {
  Form,
  Row,
  Col,
  Input,
} from '@lockerpm/design';
import {
} from "@ant-design/icons";

import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

const PersonalInfo = (props) => {
  const { } = props
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col lg={12} md={12} sm={12} xs={24}>
          <Form.Item
            name={'email'}
            className="mb-0"
            label={
              <p className="font-semibold">{t("common.email")}</p>
            }
          >
            <Input
              readOnly
              className='w-full'
            />
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={12} xs={24}>
          <Form.Item
            name={'name'}
            className="mb-0"
            label={
              <p className="font-semibold">{t("common.name")}</p>
            }
          >
            <Input
              className='w-full'
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}

export default PersonalInfo;