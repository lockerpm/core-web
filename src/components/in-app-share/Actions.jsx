import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Space,
  Button,
  Dropdown,
} from '@lockerpm/design';

import {
  EllipsisOutlined,
} from "@ant-design/icons";

const Actions = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    item = null,
    onUpdate = () => {},
    onStopSharing = () => {},
  } = props;

  const locale = useSelector((state) => state.system.locale);

  const generalMenus = useMemo(() => {
    return [
      {
        key: 'edit',
        label: t('inventory.actions.edit'),
        onClick: () => onUpdate(item)
      },
      {
        key: 'stop_sharing',
        label: t('inventory.actions.stop_sharing'),
        onClick: () => onStopSharing(item)
      },
    ]
  }, [item, locale])

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
