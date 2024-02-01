import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';

import {
  Space,
  Button,
  Dropdown,
} from '@lockerpm/design';

import {
  EllipsisOutlined
} from "@ant-design/icons";

import common from "../../utils/common";

const Actions = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    item = null,
    onUpdate = () => {},
    onDelete = () => {},
    onStop = () => {},
    onShare = () => {},
  } = props;

  const allFolders = useSelector((state) => state.folder.allFolders)
  const allCollections = useSelector((state) => state.collection.allCollections)

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
          hide: !common.isChangeCipher(originCollection),
          onClick: () => onUpdate(originCollection)
        },
        {
          key: 'share',
          hide: !common.isOwner(originCollection),
          label: t('inventory.actions.share'),
          onClick: () => onShare(originCollection)
        },
        {
          key: 'stop_share',
          hide: !common.isOwner(originCollection),
          label: t('inventory.actions.stop_sharing'),
          onClick: () => onStop(originCollection)
        },
        {
          hide: !common.isOwner(originCollection),
          type: 'divider',
        },
        {
          key: 'delete',
          hide: !common.isOwner(originCollection),
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
        label: t('inventory.actions.share'),
        onClick: () => onShare(originFolder)
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
          !!generalMenus.length && <Dropdown
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

export default Actions;
