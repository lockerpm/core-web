import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Space,
  Button,
  Dropdown,
} from '@lockerpm/design';

import {
  EllipsisOutlined
} from "@ant-design/icons";

import enterpriseMemberServices from "../../services/enterprise-member";

import global from "../../config/global";

const Actions = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    item = null,
    enterpriseId,
    onDelete = () => { },
    onReload = () => { },
  } = props;
  
  const userInfo = useSelector((state) => state.auth.userInfo)
  const locale = useSelector((state) => state.system.locale);

  const showAction = useMemo(() => {
    return item.role !== global.constants.USER_ROLE.PRIMARY_ADMIN && item.email !== userInfo?.email
  }, [item, userInfo])

  const onActivated = (payload = {}) => {
    enterpriseMemberServices
      .activated(enterpriseId, item.id, payload).then(() => {
        global.pushSuccess(t("notification.success.enterprise_members.updated"))
        onReload(payload.activated)
      }).catch((error) => {
        global.pushError(error)
      })
  }

  const onResend = () => {
    enterpriseMemberServices
      .reinvite(enterpriseId, item.id).then(() => {
        global.pushSuccess(t("notification.success.enterprise_members.reinvited"))
      }).catch((error) => {
        global.pushError(error)
      })
  }

  const generalMenus = useMemo(() => {
    if (showAction) {
      return [
        {
          key: 'disable',
          hide: !(item.is_activated && item.status === global.constants.STATUS.ACCESSED),
          label: t('button.disable'),
          onClick: () => onActivated({ activated: false })
        },
        {
          key: 'enable',
          hide: !(!item.is_activated && item.status === global.constants.STATUS.ACCESSED),
          label: t('button.enable'),
          onClick: () => onActivated({ activated: true })
        },
        {
          key: 'resend_invitation',
          hide: !(item.status === global.constants.STATUS.CREATED),
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
  }, [item, locale])

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
