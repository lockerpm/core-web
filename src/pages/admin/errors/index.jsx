import React from "react";
import './css/index.scss';

import { Divider, Button } from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import global from "../../../config/global";

import {
  ExclamationCircleOutlined,
  LeftOutlined
} from "@ant-design/icons";

const AdminErrorPage = () => {
  const { t } = useTranslation();
  const currentPage = useSelector((state) => state.system.currentPage);

  return (
    <div className="admin-error layout-content">
      <div className="admin-error__content">
        <div className="admin-error__content--top">
          <div className="flex items-center">
            <ExclamationCircleOutlined
              style={{
                fontSize: 48
              }}
            />
            <div className="ml-2">
              <p className="text-2xl">{t('error_pages.admin_error.title')}</p>
              <p>{t('common.error')} {currentPage.query.code || 404}</p>
            </div>
          </div>
          <p className="mt-2">
            {t('error_pages.admin_error.description')}
          </p>
        </div>
        <Divider />
        <div className="admin-error__content--bottom">
          <Button
            size="medium"
            className="p-0"
            type="link"
            icon={<LeftOutlined />}
            onClick={() => {global.navigate('BACK')}}
          >
            {t('button.go_back')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminErrorPage;