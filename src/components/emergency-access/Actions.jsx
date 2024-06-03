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

import { orange, green } from '@ant-design/colors';

import emergencyAccessServices from "../../services/emergency-access";

import common from "../../utils/common";
import global from "../../config/global";

const Actions = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    contact = null,
    isTrusted = false,
    fetchTrusted = () => {},
    fetchGranted = () => {},
    onResetPassword = () => {},
  } = props;

  const locale = useSelector((state) => state.system.locale);

  const reinvite = async () => {
    await emergencyAccessServices.reinvite(contact.id).then(() => {
      fetchTrusted();
      global.pushSuccess(t('notification.success.emergency_access.reinvited', { user: contact.email }))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const confirm = async () => {
    const publicKey = await emergencyAccessServices.get_public_key(contact.id);
    const key = await common.generateAccessKey(publicKey)
    await emergencyAccessServices.confirm(contact.id, { key }).then(() => {
      fetchTrusted();
      global.pushSuccess(t('notification.success.emergency_access.confirmed', { user: contact.email }))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const approve = async () => {
    global.confirm(async () => {
      await emergencyAccessServices.approve(contact.id).then(() => {
        fetchTrusted();
        global.pushSuccess(t('notification.success.emergency_access.approved'))
      }).catch((error) => {
        global.pushError(error)
      })
    }, {
      content: t('security.emergency_access.approve_question', { user: contact.full_name || contact.email, type: contact.type }),
      okText: t('security.emergency_access.actions.approve'),
      okButtonProps: { danger: false },
    })
  }

  const reject = async () => {
    await emergencyAccessServices.reject(contact.id).then(() => {
      fetchTrusted();
      global.pushSuccess(t('notification.success.emergency_access.rejected'))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const accept = async () => {
    await emergencyAccessServices.accept(contact.id).then(() => {
      fetchGranted();
      global.pushSuccess(t('notification.success.emergency_access.accepted'))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const initiate = async () => {
    global.confirm(async () => {
      await emergencyAccessServices.initiate(contact.id).then(() => {
        fetchGranted();
        global.pushSuccess(t('notification.success.emergency_access.approved'))
      }).catch((error) => {
        global.pushError(error)
      })
    }, {
      content: t('security.emergency_access.initiate_question', { day: contact.wait_time_days }),
      okText: t('button.ok'),
      okButtonProps: { danger: false },
    })
  }

  const remove = async () => {
    global.confirm(async () => {
      await emergencyAccessServices.remove(contact.id).then(() => {
        if (isTrusted) {
          fetchTrusted();
        } else {
          fetchGranted();
        }
        global.pushSuccess(t('notification.success.emergency_access.removed', { user: contact.email }))
      }).catch((error) => {
        global.pushError(error)
      })
    }, {
      content: t('security.emergency_access.delete_question'),
      okText: t('button.ok'),
      okButtonProps: { danger: false },
    })
  }

  const generalMenus = useMemo(() => {
    if (isTrusted) {
      return [
        {
          key: 'reinvite',
          hide: contact?.status !== global.constants.STATUS.INVITED,
          label: <span style={{ color: orange[5] }}>
            {t('security.emergency_access.actions.reinvite')}
          </span>,
          onClick: () => reinvite()
        },
        {
          key: 'confirm',
          hide: contact?.status !== global.constants.STATUS.ACCEPTED,
          label: <span style={{ color: green[5] }}>
            {t('button.confirm')}
          </span>,
          onClick: () => confirm()
        },
        {
          key: 'accept',
          hide: contact?.status !== global.constants.STATUS.RECOVERY_INITIATED,
          label: <span className="text-primary">
            {t('security.emergency_access.actions.accept')}
          </span>,
          onClick: () => approve()
        },
        {
          key: 'reject',
          hide: ![global.constants.STATUS.RECOVERY_INITIATED, global.constants.STATUS.RECOVERY_APPROVED].includes(contact?.status),
          label: <span style={{ color: orange[5] }}>
            {t('security.emergency_access.actions.reject')}
          </span>,
          onClick: () => reject()
        },
        {
          key: 'remove',
          label: t('button.remove'),
          danger: true,
          onClick: () => remove()
        },
      ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
    }
    return [
      {
        key: 'accept',
        hide: contact?.status !== global.constants.STATUS.INVITED,
        label:  <span className="text-primary">{t('security.emergency_access.actions.accept')}</span>,
        onClick: () => accept()
      },
      {
        key: 'request_access',
        hide: contact?.status !== global.constants.STATUS.CONFIRMED,
        label: t('security.emergency_access.actions.request_access'),
        onClick: () => initiate()
      },
      {
        key: 'view',
        hide: contact?.status !== global.constants.STATUS.RECOVERY_APPROVED || contact?.type !== global.constants.ACCESS_TYPE.VIEW,
        label: <span className="text-primary">{t('security.emergency_access.actions.view')}</span>,
        onClick: () => global.navigate(global.keys.EMERGENCY_ACCESS_VIEW, { contact_id: contact.id })
      },
      {
        key: 'reset_pw',
        hide: contact?.status !== global.constants.STATUS.RECOVERY_APPROVED || contact?.type !== global.constants.ACCESS_TYPE.TAKEOVER,
        label: t('security.emergency_access.actions.reset_their_lp'),
        onClick: () => onResetPassword(contact)
      },
      {
        key: 'remove',
        label: t('button.remove'),
        danger: true,
        onClick: () => remove()
      },
    ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
  }, [contact, isTrusted, locale])

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
