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

const Actions = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    cipher = null,
    onUpdate = () => {},
    onDelete = () => {}
  } = props;

  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const originCipher = useMemo(() => {
    return allCiphers.find((d) => d.id === cipher?.id) || cipher
  }, [allCiphers, cipher])

  const generalMenus = useMemo(() => {
    return [
      {
        key: 'edit',
        label: t('inventory.actions.edit'),
        onClick: () => onUpdate(originCipher)
      },
      {
        key: 'delete',
        label: t('inventory.actions.permanently_deleted'),
        danger: true,
        onClick: () => onDelete(originCipher)
      },
    ]
  }, [originCipher])

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

export default Actions;
