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
import global from "../../../../../../config/global";

import { orange, green } from '@ant-design/colors';

const Actions = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    contact = null,
    isTrusted = false
  } = props;

  const generalMenus = useMemo(() => {
    if (isTrusted) {
      return [
        {
          key: 'reinvite',
          hide: contact?.status !== global.constants.STATUS.INVITED,
          label: <span style={{ color: orange[5] }}>
            {t('security.emergency_access.actions.reinvite')}
          </span>,
          onClick: () => {}
        },
        {
          key: 'confirm',
          hide: contact?.status !== global.constants.STATUS.ACCEPTED,
          label: <span style={{ color: green[5] }}>
            {t('common.confirm')}
          </span>,
          onClick: () => {}
        },
        {
          key: 'accept',
          hide: contact?.status !== global.constants.STATUS.RECOVERY_INITIATED,
          label: <span className="text-primary">
            {t('security.emergency_access.actions.accept')}
          </span>,
          onClick: () => {}
        },
        {
          key: 'initiated_reject',
          hide: contact?.status !== global.constants.STATUS.RECOVERY_INITIATED,
          label: <span style={{ color: orange[5] }}>
            {t('security.emergency_access.actions.reject')}
          </span>,
          onClick: () => {}
        },
        {
          key: 'approved_reject',
          hide: contact?.status !== global.constants.STATUS.RECOVERY_APPROVED,
          label: <span style={{ color: orange[5] }}>
            {t('security.emergency_access.actions.reject')}
          </span>,
          onClick: () => {}
        },
        {
          key: 'remove',
          label: t('button.remove'),
          danger: true,
          onClick: () => {}
        },
      ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
    }
    return [
      {
        key: 'accept',
        hide: contact?.status !== global.constants.STATUS.INVITED,
        label:  <span className="text-primary">{t('security.emergency_access.actions.accept')}</span>,
        onClick: () => {}
      },
      {
        key: 'request_access',
        hide: contact?.status !== global.constants.STATUS.CONFIRMED,
        label: t('security.emergency_access.actions.request_access'),
        onClick: () => {}
      },
      {
        key: 'view',
        hide: contact?.status !== global.constants.STATUS.RECOVERY_APPROVED || contact?.type !== global.constants.ACCESS_TYPE.VIEW,
        label: <span className="text-primary">{t('security.emergency_access.actions.view')}</span>,
        onClick: () => {}
      },
      {
        key: 'reset_master_pw',
        hide: contact?.status !== global.constants.STATUS.RECOVERY_APPROVED || contact?.type !== global.constants.ACCESS_TYPE.TAKEOVER,
        label: t('security.emergency_access.actions.reset_their_lmp'),
        onClick: () => {}
      },
      {
        key: 'reset_pw',
        hide: contact?.status !== global.constants.STATUS.RECOVERY_APPROVED || contact?.type !== global.constants.ACCESS_TYPE.TAKEOVER,
        label: t('security.emergency_access.actions.reset_their_lp'),
        onClick: () => {}
      },
      {
        key: 'remove',
        label: t('button.remove'),
        danger: true,
        onClick: () => {}
      },
    ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
  }, [contact, isTrusted])

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
