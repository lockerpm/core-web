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
import global from "../../../../../config/global";
import enterpriseMemberServices from "../../../../../services/enterprise-member";

const Actions = (props) => {
  const { t } = useTranslation()
  const userInfo = useSelector((state) => state.auth.userInfo)
  const {
    className = '',
    item = null,
    enterpriseId,
    mailConfig = null,
    onDelete = () => { },
    onReload = () => { },
  } = props;

  const showAction = useMemo(() => {
    return item.role !== global.constants.USER_ROLE.PRIMARY_ADMIN && item.email !== userInfo?.email
  }, [item, userInfo])

  const onUpdate = (payload = {}) => {
    enterpriseMemberServices
      .update(enterpriseId, item.id, payload).then(() => {
        global.pushSuccess(t("notification.success.enterprise_members.updated"))
        onReload()
      }).catch((error) => {
        global.pushError(error)
      })
  }

  const onActivated = (payload = {}) => {
    enterpriseMemberServices
      .activated(enterpriseId, item.id, payload).then(() => {
        global.pushSuccess(t("notification.success.enterprise_members.updated"))
        onReload()
      }).catch((error) => {
        global.pushError(error)
      })
  }

  const onResend = () => {
    enterpriseMemberServices
      .reinvite(enterpriseId, item.id, payload).then(() => {
        global.pushSuccess(t("notification.success.enterprise_members.reinvited"))
      }).catch((error) => {
        global.pushError(error)
      })
  }

  const generalMenus = useMemo(() => {
    if (showAction) {
      return [
        {
          key: 'confirm',
          hide: item.status !== global.constants.STATUS.REQUESTED,
          label: <p className="text-primary">
            {t('button.confirm')}
          </p>,
          onClick: () => onUpdate({ status: global.constants.STATUS.CONFIRMED })
        },
        {
          key: 'disable',
          hide: !(item.is_activated && item.status === global.constants.STATUS.CONFIRMED),
          label: t('button.disable'),
          onClick: () => onActivated({ activated: false })
        },
        {
          key: 'enable',
          hide: !(!item.is_activated && item.status === global.constants.STATUS.CONFIRMED),
          label: t('button.enable'),
          onClick: () => onActivated({ activated: true })
        },
        {
          key: 'resend_invitation',
          hide: !(item.status === global.constants.STATUS.INVITED && mailConfig),
          label: t('button.resend_invitation'),
          onClick: () => onResend()
        },
        {
          key: 'remove',
          label: t('button.remove'),
          danger: true,
          onClick: () => onDelete(item)
        },
      ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
    }
    return []
  }, [item])

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
              icon={<EllipsisOutlined style={{ fontSize: 16 }} />}
            />
          </Dropdown>
        }
      </Space>
    </div>
  );
}

export default Actions;