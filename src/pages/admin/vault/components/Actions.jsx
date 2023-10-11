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

import common from "../../../../utils/common";
import { CipherType } from "../../../../core-js/src/enums";

import global from "../../../../config/global";

const CipherActions = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    item = null
  } = props;

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
            value: item.login.password
          },
        ]
      case CipherType.Login:
        return [
          {
            key: 'copy_username',
            label: t('inventory.actions.copy_username'),
            value: item.login.username
          },
          {
            key: 'copy_password',
            label: t('inventory.actions.copy_password'),
            value: item.login.password
          },
          {
            key: 'copy_totp',
            label: t('inventory.actions.copy_totp'),
            disabled: !loginTotp,
            value: loginTotp,
          }
        ]
      case CipherType.SecureNote:
        return [
          {
            key: 'copy_note',
            label: t('inventory.actions.copy_note'),
            value: item.notes,
            disabled: !item.notes,
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
            value: item.cryptoWallet.seed,
            disabled: !item.cryptoWallet.seed,
          },
          {
            key: 'copy_wallet_address',
            label: t('inventory.actions.copy_wallet_address'),
            value: item.cryptoWallet.address,
            disabled: !item.cryptoWallet.address,
          },
          {
            key: 'copy_private_key',
            label: t('inventory.actions.copy_private_key'),
            value: item.cryptoWallet.privateKey,
            disabled: !item.cryptoWallet.privateKey,
          },
          {
            key: 'copy_password_pin',
            label: t('inventory.actions.copy_password_pin'),
            value: item.cryptoWallet.password,
            disabled: !item.cryptoWallet.password,
          },
        ]
      default:
        return [];
    }
  }, [item, loginTotp])

  const shareMenus = useMemo(() => {
    return [
      {
        key: 'in_app_shares',
        label: <Tooltip
          title={t('inventory.actions.in_app_shares_note')}
        >
          <p>{t('inventory.actions.in_app_shares')}</p>
        </Tooltip>
      },
      {
        key: 'get_shareable_link',
        label: <Tooltip
          title={t('inventory.actions.get_shareable_link_note')}
        >
          <p>{t('inventory.actions.get_shareable_link')}</p>
        </Tooltip>
      },
    ]
  })

  const generalMenus = useMemo(() => {
    return [
      {
        key: 'edit',
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
        type: 'divider',
      },
      {
        key: 'delete',
        label: t('inventory.actions.delete'),
        danger: true,
      },
    ]
  })

  const role = useMemo(() => {
    return {
      isGoToWeb: !item.isDeleted && !!item.login?.canLaunch,
      isCopy: copyMenus.length > 0,
      isShares: true,
      isGeneral: item.type !== CipherType.MasterPassword
    }
  }, [item, copyMenus])

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
              onClick={() => common.openNewTab(item.login.url)}
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
