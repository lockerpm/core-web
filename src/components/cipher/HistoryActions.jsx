import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import { } from 'react-router-dom';

import {
  Button,
  Dropdown,
} from '@lockerpm/design';

import {
  EllipsisOutlined
} from "@ant-design/icons";

import common from "../../utils/common";

const HistoryActions = (props) => {
  const { t } = useTranslation()

  const {
    className = '',
    size = "small",
    item = {},
    isRestore = false,
    onRestore = () => {},
  } = props;

  const locale = useSelector((state) => state.system.locale);

  const generalMenus = useMemo(() => {
    return [
      {
        key: 'copy',
        label: t('common.copy'),
        onClick: () => common.copyToClipboard(item.password)
      },
      {
        key: 'restore',
        label: t('inventory.actions.restore'),
        hide: !isRestore,
        onClick: () => onRestore(item)
      },
    ].filter((m) => !m.hide)
  }, [isRestore, locale])

  return (
    <div className={className}>
      <Dropdown
        menu={{ items: generalMenus }}
        trigger={['click']}
      >
        <Button
          type="text"
          size={size}
          icon={<EllipsisOutlined style={{ fontSize: 16 }}/>}
        />
      </Dropdown>
    </div>
  );
}

export default HistoryActions;
