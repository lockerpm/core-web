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

import common from "../../utils/common";

const Actions = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    item = null,
    onStopSharing = () => {},
  } = props;

  const locale = useSelector((state) => state.system.locale);
  const sends = useSelector((state) => state.share.sends);

  const originSend = useMemo(() => {
    return sends.find((d) => d.id === item?.id)
  }, [sends, item])

  const generalMenus = useMemo(() => {
    return [
      {
        key: 'copy',
        label: t('inventory.actions.copy_link'),
        onClick: () => common.copyToClipboard(common.getPublicShareUrl(originSend))
      },
      {
        key: 'stop_sharing',
        label: t('inventory.actions.stop_sharing'),
        onClick: () => onStopSharing(originSend)
      },
    ]
  }, [originSend, locale])

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
