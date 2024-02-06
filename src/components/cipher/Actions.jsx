import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';

import {
  Space,
  Button,
  Dropdown,
  Tooltip
} from '@lockerpm/design';

import {
  ExportOutlined,
  CopyOutlined,
  ShareAltOutlined,
  EllipsisOutlined
} from "@ant-design/icons";

import { CipherType } from "../../core-js/src/enums";

import common from "../../utils/common";

const Actions = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    size = "small",
    cipher = null,
    onMove = () => {},
    onUpdate = () => {},
    onDelete = () => {},
    onRestore = () => {},
    onShare = () => {},
    onStopSharing = () => {},
    onPermanentlyDelete = () => {}
  } = props;

  const allOrganizations = useSelector((state) => state.organization.allOrganizations)
  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const originCipher = useMemo(() => {
    return allCiphers.find((d) => d.id === cipher.id) || cipher
  }, [allCiphers, cipher])

  const copyMenus = useMemo(() => {
    switch (originCipher.type) {
      case CipherType.MasterPassword:
        return [
          {
            key: 'copy_password',
            label: t('inventory.actions.copy_password'),
            onClick: () => common.copyToClipboard(originCipher.login.password)
          },
        ]
      case CipherType.Login:
        return [
          {
            key: 'copy_username',
            label: t('inventory.actions.copy_username'),
            onClick: () => common.copyToClipboard(originCipher.login.username)
          },
          {
            key: 'copy_password',
            label: t('inventory.actions.copy_password'),
            onClick: () => common.copyToClipboard(originCipher.login.password)
          },
          {
            key: 'copy_totp',
            label: t('inventory.actions.copy_totp'),
            disabled: !originCipher.login.totp,
            onClick: () => common.copyToClipboard(common.getTOTP(originCipher.login.totp))
          }
        ]
      case CipherType.SecureNote:
        return [
          {
            key: 'copy_note',
            label: t('inventory.actions.copy_note'),
            disabled: !originCipher.notes,
            onClick: () => common.copyToClipboard(originCipher.notes)
          },
        ]
      case CipherType.CryptoWallet:
        if (!originCipher.cryptoWallet) {
          return []
        }
        return [
          {
            key: 'copy_seed_phrase',
            label: t('inventory.actions.copy_seed_phrase'),
            disabled: !originCipher.cryptoWallet.seed,
            onClick: () => common.copyToClipboard(originCipher.cryptoWallet.seed)
          },
          {
            key: 'copy_wallet_address',
            label: t('inventory.actions.copy_wallet_address'),
            disabled: !originCipher.cryptoWallet.address,
            onClick: () => common.copyToClipboard(originCipher.cryptoWallet.address)
          },
          {
            key: 'copy_private_key',
            label: t('inventory.actions.copy_private_key'),
            disabled: !originCipher.cryptoWallet.privateKey,
            onClick: () => common.copyToClipboard(originCipher.cryptoWallet.privateKey)
          },
          {
            key: 'copy_password_pin',
            label: t('inventory.actions.copy_password_pin'),
            disabled: !originCipher.cryptoWallet.password,
            onClick: () => common.copyToClipboard(originCipher.cryptoWallet.password)
          },
        ]
      default:
        return [];
    }
  }, [originCipher])

  const shareMenus = useMemo(() => {
    if (originCipher.type === CipherType.MasterPassword) {
      return []
    }
    return [
      {
        key: 'in_app_shares',
        hide: !common.isCipherShareable(originCipher),
        label: <Tooltip
          title={t('shares.new_share.in_app_share_items_note')}
        >
          <p>{t('shares.new_share.in_app_share_items')}</p>
        </Tooltip>,
        onClick: () => onShare(originCipher)
      },
      {
        key: 'get_shareable_link',
        hide: !common.isCipherQuickShareable(originCipher),
        label: <Tooltip
          title={t('shares.new_share.get_shareable_link_note')}
        >
          <p>{t('shares.new_share.get_shareable_link')}</p>
        </Tooltip>,
        onClick: () => onShare(originCipher, true)
      },
    ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
  }, [originCipher, allOrganizations])

  const generalMenus = useMemo(() => {
    if (originCipher.type === CipherType.MasterPassword ) {
      return []
    }
    if (!originCipher.isDeleted) {
      return [
        {
          key: 'edit',
          hide: !common.isChangeCipher(originCipher),
          label: t('inventory.actions.edit'),
          onClick: () => onUpdate(originCipher)
        },
        {
          key: 'clone',
          label: t('inventory.actions.clone'),
          onClick: () => onUpdate(originCipher, true)
        },
        {
          key: 'move_to_folder',
          label: t('inventory.actions.move_to_folder'),
          onClick: () => onMove(originCipher)
        },
        {
          key: 'stop_sharing',
          hide: !(common.isOwner(originCipher) && originCipher.organizationId && !originCipher.collectionIds.length),
          label: t('inventory.actions.stop_sharing'),
          onClick: () => onStopSharing(originCipher)
        },
        {
          type: 'divider',
          hide: !common.isOwner(originCipher),
        },
        {
          key: 'delete',
          hide: !common.isOwner(originCipher),
          label: t('inventory.actions.delete'),
          danger: true,
          onClick: () => onDelete([originCipher.id])
        },
      ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
    }
    if (originCipher.isDeleted && common.isOwner(originCipher)) {
      return [
        {
          key: 'restore',
          label: t('inventory.actions.restore'),
          onClick: () => onRestore([originCipher.id])
        },
        {
          key: 'permanently_deleted',
          label: t('inventory.actions.permanently_deleted'),
          danger: true,
          onClick: () => onPermanentlyDelete([originCipher.id])
        },
      ]
    }
    return []
  }, [originCipher])

  const role = useMemo(() => {
    return {
      isGoToWeb: !originCipher.isDeleted && !!originCipher.login?.canLaunch,
      isCopy: !originCipher.isDeleted && copyMenus.length > 0,
      isShares: !originCipher.isDeleted && shareMenus.length > 0,
      isGeneral: generalMenus.length > 0
    }
  }, [originCipher, copyMenus, shareMenus])

  return (
    <div className={className}>
      <Space size={[4, 4]}>
        {
          role.isGoToWeb && <Tooltip
            title={t('inventory.actions.go_to_web')}
          >
            <Button
              type="text"
              size={size}
              icon={<ExportOutlined />}
              onClick={() => common.openNewTab(originCipher.login.uri)}
            />
          </Tooltip>
        }
        {
          role.isCopy && <Dropdown
            menu={{ items: copyMenus }}
            trigger={['click']}
          >
            <Button
              type="text"
              size={size}
              icon={<CopyOutlined />}
            />
          </Dropdown>
        }
        {
          role.isShares && <Dropdown
            menu={{ items: shareMenus }}
            trigger={['click']}
          >
            <Button
              type="text"
              size={size}
              icon={<ShareAltOutlined />}
            />
          </Dropdown>
        }
        {
          role.isGeneral && <Dropdown
            menu={{ items: generalMenus }}
            trigger={['click']}
          >
            <Button
              type="text"
              size={size}
              icon={<EllipsisOutlined style={{ fontSize: 16 }}/>}
            />
          </Dropdown>
        }
      </Space>
    </div>
  );
}

export default Actions;