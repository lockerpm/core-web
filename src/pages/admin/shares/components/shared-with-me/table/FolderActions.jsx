import React, { useEffect, useMemo, useState } from "react";
import {
  Space,
  Button,
  Dropdown,
  Tooltip
} from '@lockerpm/design';

import {
  EllipsisOutlined,
} from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';

import global from "../../../../../../config/global";
import common from "../../../../../../utils/common";

const FolderActions = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    folder = null,
    onUpdate = () => {},
    onLeave = () => {},
    onUpdateStatus = () => {}
  } = props;

  const allFolders = useSelector((state) => state.folder.allFolders)

  const isInvited = useMemo(() => {
    return folder.status === global.constants.STATUS.INVITED
  }, [folder])

  const isAccepted = useMemo(() => {
    return folder.status === global.constants.STATUS.ACCEPTED
  }, [folder])


  const originFolder = useMemo(() => {
    return allFolders.find((d) => d.id === folder.id) || folder
  }, [allFolders, folder])

  const generalMenus = useMemo(() => {
    if (isAccepted) {
      return [
        {
          key: 'leave',
          label: t('inventory.actions.leave'),
          danger: true,
          onClick: () => onLeave(folder)
        }
      ]
    }
    if (!originFolder.isDeleted) {
      return [
        {
          key: 'edit',
          hide: !common.isChangeCipher(originFolder),
          label: t('inventory.actions.edit'),
          onClick: () => onUpdate(originFolder)
        },
        {
          key: 'leave',
          label: t('inventory.actions.leave'),
          danger: true,
          onClick: () => onLeave(folder)
        },
      ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
    }
    return []
  }, [originFolder])

  const role = useMemo(() => {
    return {
      isGeneral: !isInvited && generalMenus.length > 0
    }
  }, [originFolder])

  return (
    <div className={className}>
      <Space size={[4, 4]}>
        {
          isInvited && <Button
            type="primary"
            rounded
            size="small"
            onClick={() => onUpdateStatus(folder, global.constants.STATUS_ACTION.ACCEPT)}
          >
            {t('inventory.actions.accept')}
          </Button>
        }
        {
          isInvited && <Button
            rounded
            size="small"
            onClick={() => onUpdateStatus(folder, global.constants.STATUS_ACTION.ACCEPT)}
          >
            {t('inventory.actions.decline')}
          </Button>
        }
        {
          role.isGeneral && <Dropdown
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
