import React, { useEffect, useState, useMemo } from "react";
import { Row, Col } from '@lockerpm/design';
import { } from "@ant-design/icons";
import { AdminHeader, ChangePasswordForm } from "../../../components";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from "../../../config/global";

const AccountChangePassword = (props) => {
  const { t } = useTranslation();

  return (
    <div className="change-password layout-content">
      <AdminHeader
        title={t('change_password.title')}
        subtitle={t('change_password.subtitle')}
        actions={[]}
      />
      <Row className="mt-4" gutter={[16, 16]}>
        <Col lg={8} md={8} sm={8} xs={24}>
          <p className="text-lg font-semibold mb-2">
            {t('change_password.your_password')}
          </p>
        </Col>
        <Col lg={8}  md={16} sm={16} xs={24}>
          <ChangePasswordForm
            onCancel={() => {}}
            callback={() => {}}
            cancelText={t('button.cancel')}
            okText={t('button.save_changes')}
          />
        </Col>
      </Row>
    </div>
  );
}

export default AccountChangePassword;