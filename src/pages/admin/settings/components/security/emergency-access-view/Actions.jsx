import React, { useMemo } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Space,
  Button,
  Dropdown,
  Tooltip
} from '@lockerpm/design';

import {
  ExportOutlined,
  CopyOutlined,
} from "@ant-design/icons";

import { CipherType } from "../../../../../../core-js/src/enums";

import common from "../../../../../../utils/common";

const Actions = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    size = "small",
    cipher = null,
    allCiphers = []
  } = props;

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

  const role = useMemo(() => {
    return {
      isGoToWeb: !originCipher.isDeleted && !!originCipher.login?.canLaunch,
      isCopy: !originCipher.isDeleted && copyMenus.length > 0,
    }
  }, [originCipher, copyMenus])

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
      </Space>
    </div>
  );
}

export default Actions;
