import React, { useEffect, useMemo, useState } from "react";
import {
  Space,
  Button,
  Dropdown,
} from '@lockerpm/design';

import {
  EllipsisOutlined,
} from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import common from "../../../../../../utils/common";

const Actions = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    item = null,
    onStopSharing = () => {},
  } = props;

  const generalMenus = useMemo(() => {
    return [
      {
        key: 'copy',
        label: t('inventory.actions.copy_link'),
        onClick: () => common.copyToClipboard(common.getPublicShareUrl(item))
      },
      {
        key: 'stop_sharing',
        label: t('inventory.actions.stop_sharing'),
        onClick: () => onStopSharing(item)
      },
    ]
  }, [item])

  return (
    <div className={className}>
      <Space size={[4, 4]}>
        <Dropdown
          menu={{ items: generalMenus }}
          trigger={['click']}
        >
          <Button
            type="text"
            size="small"
            icon={<EllipsisOutlined style={{ fontSize: 16 }}/>}
          />
        </Dropdown>
      </Space>
    </div>
  );
}

export default Actions;
