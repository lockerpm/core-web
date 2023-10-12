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

import { CipherType } from "../../../../core-js/src/enums";

import global from "../../../../config/global";
import common from "../../../../utils/common";

const CipherActions = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    item = null,
  } = props;

  const allOrganizations = useSelector((state) => state.organization.allOrganizations)

  const [loginTotp, setLoginTotp] = useState(null)

  useEffect(() => {
    fetchLoginTotp();
  }, [item])

  const fetchLoginTotp = async () => {
    let totp = null
    if (item?.login?.totp) {
      totp = await global.jsCore.totpService.getCode(item.login.totp)
    }
    setLoginTotp(totp)
  }

  const copyMenus = useMemo(() => {
    switch (item.type) {
      case CipherType.MasterPassword:
        return [
          {
            key: 'copy_password',
            label: t('inventory.actions.copy_password'),
            onClick: () => common.copyToClipboard(item.login.password)
          },
        ]
      case CipherType.Login:
        return [
          {
            key: 'copy_username',
            label: t('inventory.actions.copy_username'),
            onClick: () => common.copyToClipboard(item.login.username)
          },
          {
            key: 'copy_password',
            label: t('inventory.actions.copy_password'),
            onClick: () => common.copyToClipboard(item.login.password)
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
            disabled: !item.notes,
            onClick: () => common.copyToClipboard(item.notes)
          },
        ]
      case CipherType.CryptoWallet:
        if (!item.cryptoWallet) {
          return []
        }
        return [
          {
            key: 'copy_seed_phrase',
            label: t('inventory.actions.copy_seed_phrase'),
            disabled: !item.cryptoWallet.seed,
            onClick: () => common.copyToClipboard(item.cryptoWallet.seed)
          },
          {
            key: 'copy_wallet_address',
            label: t('inventory.actions.copy_wallet_address'),
            disabled: !item.cryptoWallet.address,
            onClick: () => common.copyToClipboard(item.cryptoWallet.address)
          },
          {
            key: 'copy_private_key',
            label: t('inventory.actions.copy_private_key'),
            disabled: !item.cryptoWallet.privateKey,
            onClick: () => common.copyToClipboard(item.cryptoWallet.privateKey)
          },
          {
            key: 'copy_password_pin',
            label: t('inventory.actions.copy_password_pin'),
            disabled: !item.cryptoWallet.password,
            onClick: () => common.copyToClipboard(item.cryptoWallet.password)
          },
        ]
      default:
        return [];
    }
  }, [item, loginTotp])

  const shareMenus = useMemo(() => {
    if (item.type === CipherType.MasterPassword) {
      return []
    }
    return [
      {
        key: 'in_app_shares',
        hide: !common.isCipherShareable(allOrganizations, item),
        label: <Tooltip
          title={t('inventory.actions.in_app_shares_note')}
        >
          <p>{t('inventory.actions.in_app_shares')}</p>
        </Tooltip>
      },
      {
        key: 'get_shareable_link',
        hide: !common.isCipherQuickShareable(item),
        label: <Tooltip
          title={t('inventory.actions.get_shareable_link_note')}
        >
          <p>{t('inventory.actions.get_shareable_link')}</p>
        </Tooltip>
      },
    ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
  }, [item, allOrganizations])

  const generalMenus = useMemo(() => {
    if (item.type === CipherType.MasterPassword ) {
      return []
    }
    if (!item.isDeleted) {
      return [
        {
          key: 'edit',
          hide: !common.isChangeCipher(allOrganizations, item),
          label: t('inventory.actions.edit')
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
          hide: !(common.isOwner(allOrganizations, item) && item.organizationId && !item.collectionIds.length),
          label: t('inventory.actions.stop_sharing')
        },
        {
          type: 'divider',
        },
        {
          key: 'delete',
          hide: !common.isOwner(allOrganizations, item),
          label: t('inventory.actions.delete'),
          danger: true,
        },
      ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
    }
    if (item.isDeleted && common.isOwner(allOrganizations, item)) {
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
      isGoToWeb: !item.isDeleted && !!item.login?.canLaunch,
      isCopy: copyMenus.length > 0,
      isShares: shareMenus.length > 0,
      isGeneral: generalMenus.length > 0
    }
  }, [item, copyMenus, shareMenus])

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
              onClick={() => common.openNewTab(item.login.uri)}
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
