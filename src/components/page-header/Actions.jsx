import React, {} from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
  Col,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

const Actions = (props) => {
  const {
    actions = [],
  } = props
  const { t } = useTranslation()

  const isMobile = useSelector((state) => state.system.isMobile);

  return (
    <>
      {
        actions.filter((a) => !a.hide).map((a) =>
          <Col key={a.key}>
            <Button
              size={a.size}
              key={a.key}
              type={a.type}
              loading={a.loading}
              danger={a.danger}
              disabled={a.disabled}
              onClick={() => a.click()}
              icon={a.icon}
            >
              {isMobile ? '' : a.label}
            </Button>
          </Col>
        )
      }
    </>
  );
}

export default Actions;