import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dropdown,
  Badge,
} from '@lockerpm/design';

import { ImageIcon } from '../../../components';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import notificationServices from "../../../services/notification";
import sharingServices from '../../../services/sharing';
import global from '../../../config/global';
import common from '../../../utils/common';
import { gray } from '@ant-design/colors';

import {
  BellOutlined,
} from '@ant-design/icons'

function Notifications() {
  const { t } = useTranslation();
  const locale = useSelector((state) => state.system.locale);
  const [callingAPI, setCallingAPI] = useState(false);
  const [total, setTotal] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    featData()
    setInterval(() => {
      featData();
    }, [1000 * 30])
  }, [])

  const getNotificationIcon = (type) => {
    switch (type) {
    case global.constants.NOTIFICATION_TYPE.ITEM_SHARING:
    case global.constants.NOTIFICATION_TYPE.MEMBER_TO_GROUP_SHARE:
      return 'sharing'
    case global.constants.NOTIFICATION_TYPE.EMERGENCY_ACCESS:
      return 'emergency-access'
    case global.constants.NOTIFICATION_TYPE.DATA_BREACH:
      return 'data-breach'
    case global.constants.NOTIFICATION_TYPE.PASSWORD_TIP_TRICK:
      return 'tip-trick'
    default:
      return 'marketing'
    }
  }

  const featData = async () => {
    await notificationServices.list({ scope: 'pwdmanager' }).then((response) => {
      setNotifications(response.results)
      setTotal(response.unread_count)
    }).catch(() => {
      setNotifications([])
    })
  }

  const items = useMemo(() => {
    return notifications.length > 0 ? [{
      type: 'group',
      label: <div className='flex items-center justify-between'>
        <p className='font-semibold'>{t('notifications.title')}</p>
        <Button
          type="primary"
          ghost
        >
          {t('notifications.mark_all_as_read')}
        </Button>
      </div>,
      children: notifications.map((n) => {
        return {
          key: n.id,
          icon: <ImageIcon
            width={32}
            height={32}
            name={`noti/${getNotificationIcon(n.type)}`}
          />,
          label: <div className='flex items-center justify-between'>
            <div>
              <p
                className='font-semibold text-limited text-limited__2'
                title={n.title[locale]}
                style={{ color: n.read ? gray[5] : '' }}
              >
                {n.title[locale]}
              </p>
              <small style={{ color: gray[2] }}>
                {common.timeFromNow(n.publish_time)}
              </small>
              {
                n.type === global.constants.NOTIFICATION_TYPE.MEMBER_TO_GROUP_SHARE && <Button
                  size="small"
                  type="primary"
                  loading={callingAPI}
                  disabled={!!n.metadata?.clicked || callingAPI}
                  onClick={() => {}}
                >
                  {
                    n.metadata?.clicked
                      ? t('common.confirmed')
                      : t('common.confirm')
                  }
                </Button>
              }
            </div>
            {
              !n.read && <Badge
                color={'green'}
                className='ml-2'
              />
            }
          </div>
        }
      })
    }] : [
      {
        icon: <></>,
        label: t('notifications.no_notifications')
      }
    ]
  }, [notifications, locale])

  const dropdownClick = async (item) => {
    const notification = notifications.find((n) => n.id === item.key);
    if (!notification.read) {
      await markAsRead(notification.id)
    }
    switch (notification.type) {
      case global.constants.NOTIFICATION_TYPE.ITEM_SHARING:
        if (notification.metadata?.my_share) {
          global.navigate(global.keys.MY_SHARED_ITEMS, {}, {
            menu_type: notification.metadata?.folder_id
              ? global.constants.MENU_TYPES.FOLDERS
              : global.constants.MENU_TYPES.CIPHERS
          })
        } else {
          global.navigate(global.keys.SHARED_WITH_ME, {}, {
            menu_type: notification.metadata?.folder_id
              ? global.constants.MENU_TYPES.FOLDERS
              : global.constants.MENU_TYPES.CIPHERS
          })
        }
        break;
      case global.constants.NOTIFICATION_TYPE.EMERGENCY_ACCESS:
          global.navigate(global.keys.SETTINGS_SECURITY, {}, { emergency_access: true })
        break;
      case global.constants.NOTIFICATION_TYPE.MEMBER_TO_GROUP_SHARE:
        const { group_id, sharing_id, emails, clicked } = notification.metadata
        if (!clicked) {
          setCallingAPI(true)
          await shareKeyToNewMember(
            notification.id,
            sharing_id,
            group_id,
            emails
          )
          setCallingAPI(false)
        }
        break;
      case global.constants.NOTIFICATION_TYPE.PASSWORD_TIP_TRICK:
        window.open(item.metadata.link[locale], '_blank')
        break;
      default:
        global.navigate(global.keys.VAULT)
        break;
    }
  }

  const markAsRead = async (id, metadata = {}) => {
    await notificationServices.update(id, {
      read: true,
      metadata
    }).then(() => {
      featData();
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const shareKeyToNewMember = async (notificationId, sharingId, groupId, emails) => {
    try {
      const orgKey = await global.jsCore.cryptoService.getOrgKey(sharingId)
      if (!orgKey) {
        global.pushError({ message: t('notifications.item_no_longer_shared') })
        return
      }
      const members = await Promise.all(
        emails.map(async email => {
          const publicKey = await sharingServices.get_public_key({ email })
          const key = publicKey
            ? await common.generateMemberKey(publicKey, orgKey)
            : null
          return {
            username: email,
            key
          }
        })
      )
      await sharingServices.add_sharing_group(sharingId, groupId, { members })
      await markAsRead(notificationId, { clicked: true })
      global.pushSuccess(t('notification.success.sharing.shared_to_new_member'))
    } catch (error) {
      global.pushError(error)
    }
  }

  return (
    <Dropdown
      menu={{
        items,
        selectedKeys: notifications.filter((n) => !n.read).map((n) => n.id),
        onClick: dropdownClick,
        style: {
          width: 400,
          height: 600,
          padding: 0,
          overflow: 'auto'
        }
      }}
      placement="bottomRight"
      trigger={'click'}
    >
      <Badge count={total}>
        <Button
          shape="circle"
          icon={<BellOutlined />}
          onClick={() => {}}
        />
      </Badge>
    </Dropdown>
  );
}

export default Notifications;