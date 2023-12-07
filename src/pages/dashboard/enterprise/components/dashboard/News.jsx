import React, { } from "react";
import {
  Card,
  List
} from '@lockerpm/design';

import { RouterLink } from "../../../../../components";

import {
} from "@ant-design/icons";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

const News = (props) => {
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
      <p className="font-semibold text-gray mb-2 text-xl">
        {t('enterprise_dashboard.news.title')}
      </p>
      <List
        itemLayout="horizontal"
        dataSource={
          [
            {
              key: 'users_blocked',
              title: t('enterprise_dashboard.news.users_blocked'),
              value: data?.block_failed_login?.length || 0
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

export default News;