import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Card,
  List,
  Avatar
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../../../../../components/items";

const UsersBlocked = (props) => {
  const { RouterLink } = itemsComponents;
  const {
    loading = false,
    data = {},
    enterpriseId
  } = props;

  const { t } = useTranslation();

  return (
    <Card
      loading={loading}
      title={false}
      hoverable={false}
      className="h-full"
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-black-500 mb-2 text-xl">
          {t('enterprise_dashboard.users_blocked.title')}
        </p>
        <p
          className="text-2xl font-bold text-primary"
        >
          {data?.block_failed_login?.length || 0}
        </p>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={data?.block_failed_login || []}
        renderItem={(item) => (
          <List.Item>
            <div className='flex items-center'>
              <Avatar src={item.avatar} />
              <div className='ml-2'>
                <RouterLink
                  className={"font-semibold"}
                  label={item.full_name}
                  routerName={global.keys.ENTERPRISE_MEMBER}
                  routerParams={{ enterprise_id: enterpriseId, member_id: item.id }}
                />
                <p className='text-xs'>{item.email}</p>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}

export default UsersBlocked;