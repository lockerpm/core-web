import React, { useMemo, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
} from '@lockerpm/design';

import {
  UndoOutlined,
} from "@ant-design/icons";

import securityDrawersComponents from "./drawers";
import { KdfType } from "../../../../../core-js/src/enums/kdfType";
import common from "../../../../../utils/common";
import { CipherType } from "../../../../../core-js/src/enums";

const EncryptionKeySettings = (props) => {
  const { UpdateEncryptionSettingsDrawer } = securityDrawersComponents;
  const {
    className = '',
  } = props;
  const { t } = useTranslation();

  const isMobile = useSelector(state => state.system.isMobile);
  const userInfo = useSelector(state => state.auth.userInfo);
  const allCiphers = useSelector((state) => state.cipher.allCiphers);

  const [formVisible, setFormVisible] = useState(false);

  const masterPassword = useMemo(() => {
    return allCiphers.find((c) => !c.isDeleted && c.type === CipherType.MasterPassword)
  }, [allCiphers])

  const disabled = useMemo(() => {
    return userInfo?.kdf_version < 1 || userInfo.is_require_passwordless || !masterPassword
  }, [userInfo, masterPassword])

  return (
    <div className={className}>
      <div className="flex justify-between">
        <p className="font-semibold text-xl text-primary">
          {t('security.encryption_key_settings.title')}
        </p>
        <Button
          type='primary'
          ghost
          icon={<UndoOutlined />}
          disabled={disabled}
          onClick={() => setFormVisible(true)}
        >
          {isMobile ? '' : t('security.encryption_key_settings.action')}
        </Button>
      </div>
      <p className="mt-1">
        {t('security.encryption_key_settings.description')}
      </p>
      <div className="mt-4 flex flex-col gap-1">
        <p>
          <span className="font-semibold">{t('security.encryption_key_settings.algorithm')}</span>: {userInfo?.kdf === KdfType.PBKDF2_SHA256 ? 'PBKDF2' : 'ARGON2ID'}
        </p>
        <p><span className="font-semibold">{t('security.encryption_key_settings.iterations')}</span>: { common.separatorNumber(userInfo.kdf_iterations) }</p>
        {
          userInfo.kdf_memory && <p><span className="font-semibold">{t('security.encryption_key_settings.memory')}</span>: { common.separatorNumber(userInfo.kdf_memory / 1024) }</p>
        }
        {
          userInfo.kdf_parallelism && <p><span className="font-semibold">{t('security.encryption_key_settings.parallelism')}</span>: { common.separatorNumber(userInfo.kdf_parallelism) }</p>
        }
      </div>
      <UpdateEncryptionSettingsDrawer
        visible={formVisible}
        onClose={() => setFormVisible(false)}
      />
    </div>
  );
}

export default EncryptionKeySettings;
