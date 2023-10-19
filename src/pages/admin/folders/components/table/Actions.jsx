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
import common from "../../../../../utils/common";

const FolderActions = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    item = null,
    onUpdate = () => {},
    onDelete = () => {},
    onStop = () => {}
  } = props;

  const allFolders = useSelector((state) => state.folder.allFolders)
  const allCollections = useSelector((state) => state.collection.allCollections)
  const allOrganizations = useSelector((state) => state.organization.allOrganizations)

  const originCollection = useMemo(() => {
    return allCollections.find((d) => d.id === item?.id)
  }, [allCollections, item])

  const originFolder = useMemo(() => {
    return allFolders.find((d) => d.id === item?.id)
  }, [allFolders, item])

  const generalMenus = useMemo(() => {
    if (originCollection) {
      return [
        {
          key: 'rename',
          label: t('inventory.actions.edit'),
          hide: !common.isChangeCipher(allOrganizations, originCollection),
          onClick: () => onUpdate(originCollection)
        },
        {
          key: 'share',
          hide: !common.isOwner(allOrganizations, originCollection),
          label: t('inventory.actions.share')
        },
        {
          key: 'stop_share',
          hide: !common.isOwner(allOrganizations, originCollection),
          label: t('inventory.actions.stop_sharing'),
          onClick: () => onStop(originCollection)
        },
        {
          hide: !common.isOwner(allOrganizations, originCollection),
          type: 'divider',
        },
        {
          key: 'delete',
          hide: !common.isOwner(allOrganizations, originCollection),
          label: t('inventory.actions.delete'),
          danger: true,
          onClick: () => onDelete(originCollection)
        },
      ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
    }
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
  }, [originFolder, originCollection])

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
