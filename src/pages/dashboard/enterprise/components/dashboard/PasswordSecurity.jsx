import React from "react";
import { useTranslation } from "react-i18next";

import {
  Card,
  List
} from '@lockerpm/design';

const PasswordSecurity = (props) => {
  const {
    loading = false,
    data = {}
  } = props;

  const { t } = useTranslation();

  return (
    <Card
      loading={loading}
      title={false}
      hoverable={false}
      className="h-full"
    >
      <p className="font-semibold text-black-500 mb-2 text-xl">
        {t('enterprise_dashboard.password_security.title')}
      </p>
      <List
        itemLayout="horizontal"
        dataSource={
          [
            {
              key: 'weak_master_password',
              title: t('enterprise_dashboard.password_security.weak_password'),
              value: data?.password_security?.weak_master_password || 0
            },
            {
              key: 'weak_password',
              title: t('enterprise_dashboard.password_security.more_than_weak_passwords'),
              value: data?.password_security?.weak_password || 0
            },
            {
              key: 'leaked_account',
              title: t('enterprise_dashboard.password_security.leaked_account'),
              value: data?.password_security?.leaked_account || 0
            },
          ]
        }
        renderItem={(item) => (
          <List.Item>
            <div className="flex items-center">
              <p
                className="text-2xl font-bold text-primary w-6"
              >
                {item.value}
              </p>
              <p>{item.title}</p>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}

export default PasswordSecurity;