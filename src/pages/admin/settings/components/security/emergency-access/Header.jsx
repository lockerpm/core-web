import React from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
  Badge,
} from '@lockerpm/design';

import {
  DownOutlined,
  RightOutlined,
  PlusOutlined
} from "@ant-design/icons";

const EAHeader = (props) => {
  const { t } = useTranslation();
  const isMobile = useSelector(state => state.system.isMobile);

  const {
    expand = false,
    className = '',
    pendingRequests = 0,
    setExpand = () => {},
    onCreate = () => {}
  } = props;

  return (
    <div className={className}>
      <div className="flex justify-between">
        <div
          className="flex text-primary cursor-pointer"
          onClick={() => setExpand(!expand)}
        >
          <p className="font-semibold text-xl mr-2">
            {t('security.emergency_access.title')}
          </p>
          {
            !!pendingRequests && <Badge
              className="flex items-center mr-2"
              count={pendingRequests}
            />
          }
          {
            expand ? <DownOutlined /> : <RightOutlined />
          }
        </div>
        <Button
          type='primary'
          ghost
          icon={<PlusOutlined />}
          onClick={() => onCreate()}
        >
          {isMobile ? '' : t('security.emergency_access.add')}
        </Button>
      </div>
      <p className="mt-1">
        {t('security.emergency_access.description')}
      </p>
    </div>
  );
}

export default EAHeader;
