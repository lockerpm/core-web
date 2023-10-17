import React, { useEffect, useMemo, useState } from "react";
import {
  Space,
  Button,
  Dropdown,
} from '@lockerpm/design';

import {
  EllipsisOutlined
} from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';

const FolderActions = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    folder = null,
    onUpdate = () => {},
    onDelete = () => {}
  } = props;

  const allFolders = useSelector((state) => state.folder.allFolders)
  const allOrganizations = useSelector((state) => state.organization.allOrganizations)

  const originFolder = useMemo(() => {
    return allFolders.find((d) => d.id === folder?.id) || folder
  }, [allFolders, folder])

  const generalMenus = useMemo(() => {
    return [
      {
        key: 'rename',
        label: t('inventory.actions.edit'),
        onClick: () => onUpdate(originFolder)
      },
      {
        key: 'share',
        label: t('inventory.actions.share')
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: t('inventory.actions.delete'),
        danger: true,
        onClick: () => onDelete(originFolder)
      },
    ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
  }, [originFolder])

  return (
    <div className={className}>
      <Space size={[4, 4]}>
        {
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
        }
      </Space>
    </div>
  );
}

export default FolderActions;
