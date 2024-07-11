import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
  Dropdown,
  Badge,
} from '@lockerpm/design';

import {
  BellOutlined,
} from '@ant-design/icons'

import { gray } from '@ant-design/colors';

import itemsComponents from '../items';

import notificationServices from "../../services/notification";
import sharingServices from '../../services/sharing';

import global from '../../config/global';
import common from '../../utils/common';

let interval = null;

function Notifications() {
  const { ImageIcon } = itemsComponents;
  const { t } = useTranslation();

  const locale = useSelector((state) => state.system.locale);

  const [callingAPI, setCallingAPI] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    featData()
  }, [])

  useEffect(() => {
    clearInterval(interval)
    scrollToTop();
    setPage(1);
    if (!isOpen) {
      interval = setInterval(() => {
        featData();
      }, 1000 * 30)
    }
  }, [isOpen])

  const totalPage = useMemo(() => {
    return Math.ceil(total / 20)
  }, [total])

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

  const featData = async (page = 1) => {
    const isLocked = await global.jsCore?.vaultTimeoutService.isLocked()
    if (!isLocked) {
      await notificationServices.list({ scope: 'pwdmanager', page: page }).then((response) => {
        if (page === 1) {
          setNotifications(response.results);
        } else {
          setNotifications([...notifications, ...response.results]);
        }
        setUnreadCount(response.unread_count);
        setTotal(response.count)
      }).catch(() => {
        setNotifications([])
        setUnreadCount(0)
      })
    } else {
      setNotifications([])
      setUnreadCount(0)
      setTotal(0)
    }
  }

  const items = useMemo(() => {
    return notifications.length > 0 ? [{
      type: 'group',
      label: <div className='flex items-center justify-between'>
        <p className='font-semibold'>{t('notifications.title')}</p>
        {
          unreadCount > 0 && <Button
            type="primary"
            ghost
            onClick={() => markAsReadAll()}
          >
            {t('notifications.mark_all_as_read')}
          </Button>
        }
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
    if (!notification) {
      return;
    }
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
        const link = item.metadata?.link ? item.metadata?.link[locale] : ''
        common.openNewTab(link)
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

  const markAsReadAll = async () => {
    await notificationServices.read_all({ scope: 'pwdmanager' }).then(() => {
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
            ? await global.jsCore.cryptoService.generateMemberKey(publicKey, { id: sharingId })
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

  const scrollEnd =  (event) => {
    if (event.target?.scrollTop == event.target?.scrollTopMax) {
      if (total > notifications.length && (page + 1 <= totalPage)) {
        const newPage = page + 1;
        setPage(newPage);
        featData(newPage);
      }
    }
  }

  const scrollToTop = () => {
    const layoutContent = document.querySelector('.notification-menu')
    if (layoutContent) {
      layoutContent.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    }
  }

  return (
    <Dropdown
      menu={{
        items,
        selectedKeys: notifications.filter((n) => !n.read).map((n) => n.id),
        onClick: dropdownClick,
        onScroll: scrollEnd,
        className: 'notification-menu',
        style: {
          maxWidth: 360,
          maxHeight: 480,
          padding: '8px 0',
          overflow: 'auto'
        }
      }}
      placement="bottomRight"
      trigger={'click'}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <Badge count={unreadCount}>
        <Button
          shape="circle"
          icon={<BellOutlined />}
        />
      </Badge>
    </Dropdown>
  );
}

export default Notifications;