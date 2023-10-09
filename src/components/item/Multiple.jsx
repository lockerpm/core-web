import React from "react";
import {
  Row,
  Col,
  Button,
} from '@lockerpm/design';

import {
  DeleteOutlined
} from "@ant-design/icons";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

const MultipleSelect = (props) => {
  const {
    name = '',
    selectedRowKeys = [],
    callingAPI = false,
    multipleDelete = () => { },
    onCancel = () => { }
  } = props;

  const { t } = useTranslation()

  return (
    <Row
      className="filter"
      justify={'space-between'}
      gutter={[0, 8]}
    >
      <Col>
        <Row
          align={'middle'}
          justify={'left'}
          gutter={[16, 16]}
        >
          <Col>
            <p className="text-s">{t('common.selectedItems', { amount: selectedRowKeys.length, name: name })}</p>
          </Col>
          <Col>
            <Button
              size="medium"
              ghost
              type={'primary'}
              loading={callingAPI}
              danger
              onClick={() => multipleDelete()}
              icon={<DeleteOutlined />}
            >
              {t('button.delete')}
            </Button>
          </Col>
          <Col>
            <Button
              size="medium"
              disabled={callingAPI}
              onClick={() => onCancel()}
            >
              {t('button.cancel')}
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default MultipleSelect;