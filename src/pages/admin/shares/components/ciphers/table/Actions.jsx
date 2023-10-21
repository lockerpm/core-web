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
  EllipsisOutlined,
} from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';

import { CipherType } from "../../../../../../core-js/src/enums";

import global from "../../../../../../config/global";
import common from "../../../../../../utils/common";

const Actions = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    cipher = null,
    onMove = () => {},
    onUpdate = () => {},
    onLeave = () => {},
    onUpdateStatus = () => {}
  } = props;

  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const isInvited = useMemo(() => {
    return cipher.status === global.constants.STATUS.INVITED
  }, [cipher])

  const isAccepted = useMemo(() => {
    return cipher.status === global.constants.STATUS.ACCEPTED
  }, [cipher])


  const originCipher = useMemo(() => {
    return allCiphers.find((d) => d.id === cipher.id) || cipher
  }, [allCiphers, cipher])

  const copyMenus = useMemo(() => {
    switch (originCipher?.type) {
      case CipherType.Login:
        return [
          {
            key: 'copy_username',
            label: t('inventory.actions.copy_username'),
            disabled: !originCipher.login.username,
            onClick: () => common.copyToClipboard(originCipher.login.username)
          },
          {
            key: 'copy_password',
            label: t('inventory.actions.copy_password'),
            disabled: !originCipher.login.password,
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

  const generalMenus = useMemo(() => {
    if (isAccepted) {
      return [
        {
          key: 'leave',
          label: t('inventory.actions.leave'),
          danger: true,
          onClick: () => onLeave(originCipher)
        }
      ]
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
          type: 'divider',
        },
        {
          key: 'leave',
          label: t('inventory.actions.leave'),
          danger: true,
          onClick: () => onLeave(originCipher)
        },
      ].filter((m) => !m.hide).map((m) => { delete m.hide; return m })
    }
    return []
  }, [originCipher])

  const role = useMemo(() => {
    return {
      isGoToWeb: !originCipher.isDeleted && !!originCipher.login?.canLaunch && !isInvited,
      isCopy: !isInvited && !originCipher?.isDeleted && copyMenus.length > 0,
      isGeneral: !isInvited && generalMenus.length > 0
    }
  }, [originCipher, copyMenus])

  return (
    <div className={className}>
      <Space size={[4, 4]}>
        {
          isInvited && <Button
            type="primary"
            size="small"
            onClick={() => onUpdateStatus(cipher, global.constants.STATUS_ACTION.ACCEPT)}
          >
            {t('inventory.actions.accept')}
          </Button>
        }
        {
          isInvited && <Button
            size="small"
            onClick={() => onUpdateStatus(cipher, global.constants.STATUS_ACTION.REJECT)}
          >
            {t('inventory.actions.decline')}
          </Button>
        }
        {
          role.isGoToWeb && <Tooltip
            title={t('inventory.actions.go_to_web')}
          >
            <Button
              type="text"
              size="small"
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
              size="small"
              icon={<CopyOutlined />}
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

export default Actions;
