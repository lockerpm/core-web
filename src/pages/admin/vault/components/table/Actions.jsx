import React, { useEffect, useMemo, useState } from "react";
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

import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';

import { CipherType } from "../../../../../core-js/src/enums";

import global from "../../../../../config/global";
import common from "../../../../../utils/common";

const CipherActions = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    cipher = null,
    onUpdate = () => {}
  } = props;

  const allOrganizations = useSelector((state) => state.organization.allOrganizations)

  const [loginTotp, setLoginTotp] = useState(null)

  useEffect(() => {
    fetchLoginTotp();
  }, [cipher])

  const fetchLoginTotp = async () => {
    let totp = null
    if (cipher?.login?.totp) {
      totp = await global.jsCore.totpService.getCode(cipher.login.totp)
    }
    setLoginTotp(totp)
  }

  const copyMenus = useMemo(() => {
    switch (cipher.type) {
      case CipherType.MasterPassword:
        return [
          {
            key: 'copy_password',
            label: t('inventory.actions.copy_password'),
            onClick: () => common.copyToClipboard(cipher.login.password)
          },
        ]
      case CipherType.Login:
        return [
          {
            key: 'copy_username',
            label: t('inventory.actions.copy_username'),
            onClick: () => common.copyToClipboard(cipher.login.username)
          },
          {
            key: 'copy_password',
            label: t('inventory.actions.copy_password'),
            onClick: () => common.copyToClipboard(cipher.login.password)
          },
          {
            key: 'copy_totp',
            label: t('inventory.actions.copy_totp'),
            disabled: !loginTotp,
            onClick: () => common.copyToClipboard(loginTotp)
          }
        ]
      case CipherType.SecureNote:
        return [
          {
            key: 'copy_note',
            label: t('inventory.actions.copy_note'),
            disabled: !cipher.notes,
            onClick: () => common.copyToClipboard(cipher.notes)
          },
        ]
      case CipherType.CryptoWallet:
        if (!cipher.cryptoWallet) {
          return []
        }
        return [
          {
            key: 'copy_seed_phrase',
            label: t('inventory.actions.copy_seed_phrase'),
            disabled: !cipher.cryptoWallet.seed,
            onClick: () => common.copyToClipboard(cipher.cryptoWallet.seed)
          },
          {
            key: 'copy_wallet_address',
            label: t('inventory.actions.copy_wallet_address'),
            disabled: !cipher.cryptoWallet.address,
            onClick: () => common.copyToClipboard(cipher.cryptoWallet.address)
          },
          {
            key: 'copy_private_key',
            label: t('inventory.actions.copy_private_key'),
            disabled: !cipher.cryptoWallet.privateKey,
            onClick: () => common.copyToClipboard(cipher.cryptoWallet.privateKey)
          },
          {
            key: 'copy_password_pin',
            label: t('inventory.actions.copy_password_pin'),
            disabled: !cipher.cryptoWallet.password,
            onClick: () => common.copyToClipboard(cipher.cryptoWallet.password)
          },
        ]
      default:
        return [];
    }
  }, [cipher, loginTotp])

  const shareMenus = useMemo(() => {
    if (cipher.type === CipherType.MasterPassword) {
      return []
    }
    return [
      {
        key: 'in_app_shares',
        hide: !common.isCipherShareable(allOrganizations, cipher),
        label: <Tooltip
          title={t('inventory.actions.in_app_shares_note')}
        >
          <p>{t('inventory.actions.in_app_shares')}</p>
        </Tooltip>
      },
      {
        key: 'get_shareable_link',
        hide: !common.isCipherQuickShareable(cipher),
        label: <Tooltip
          title={t('inventory.actions.get_shareable_link_note')}
        >
          <p>{t('inventory.actions.get_shareable_link')}</p>
        </Tooltip>
      },
    ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
  }, [cipher, allOrganizations])

  const generalMenus = useMemo(() => {
    if (cipher.type === CipherType.MasterPassword ) {
      return []
    }
    if (!cipher.isDeleted) {
      return [
        {
          key: 'edit',
          hide: !common.isChangeCipher(allOrganizations, cipher),
          label: t('inventory.actions.edit'),
          onClick: () => onUpdate()
        },
        {
          key: 'clone',
          label: t('inventory.actions.clone')
        },
        {
          key: 'move_to_folder',
          label: t('inventory.actions.move_to_folder')
        },
        {
          key: 'stop_sharing',
          hide: !(common.isOwner(allOrganizations, cipher) && cipher.organizationId && !cipher.collectionIds.length),
          label: t('inventory.actions.stop_sharing')
        },
        {
          type: 'divider',
        },
        {
          key: 'delete',
          hide: !common.isOwner(allOrganizations, cipher),
          label: t('inventory.actions.delete'),
          danger: true,
        },
      ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
    }
    if (cipher.isDeleted && common.isOwner(allOrganizations, cipher)) {
      return [
        {
          key: 'restore',
          label: t('inventory.actions.restore')
        },
        {
          key: 'permanently_delete',
          label: t('inventory.actions.permanently_delete'),
          danger: true,
        },
      ]
    }
    return []
  })

  const role = useMemo(() => {
    return {
      isGoToWeb: !cipher.isDeleted && !!cipher.login?.canLaunch,
      isCopy: copyMenus.length > 0,
      isShares: shareMenus.length > 0,
      isGeneral: generalMenus.length > 0
    }
  }, [cipher, copyMenus, shareMenus])

  return (
    <div className={className}>
      <Space size={[4, 4]}>
        {
          role.isGoToWeb && <Tooltip
            title={t('inventory.actions.go_to_web')}
          >
            <Button
              type="text"
              size="small"
              icon={<ExportOutlined />}
              onClick={() => common.openNewTab(cipher.login.uri)}
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
              size="small"
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
              size="small"
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
              size="small"
              icon={<EllipsisOutlined style={{ fontSize: 16 }}/>}
            />
          </Dropdown>
        }
      </Space>
    </div>
  );
}

export default CipherActions;
