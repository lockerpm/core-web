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

import global from "../../../../../config/global";

const PersonalInfo = (props) => {
  const { callingAPI } = props
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col lg={12} md={12} sm={12} xs={24}>
          <Form.Item
            name={'username'}
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
            name={'full_name'}
            label={
              <p className="font-semibold">{t("common.full_name")}</p>
            }
          >
            <Input
              disabled={callingAPI}
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