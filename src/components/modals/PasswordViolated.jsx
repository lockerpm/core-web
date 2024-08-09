import React, { useMemo } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Modal,
  Button
} from '@lockerpm/design';

import { } from "@ant-design/icons";

const PasswordViolatedModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    item = { violations: [] },
    onClose = () => { },
  } = props;

  const minLength = useMemo(() => {
    return item?.violations?.find((v) => v.key === 'minLength')
  }, [item])

  const requireSpecialCharacter = useMemo(() => {
    return item?.violations?.find((v) => v.key === 'requireSpecialCharacter')
  }, [item])

  const requireLowerCase = useMemo(() => {
    return item?.violations?.find((v) => v.key === 'requireLowerCase')
  }, [item])

  const requireUpperCase = useMemo(() => {
    return item?.violations?.find((v) => v.key === 'requireUpperCase')
  }, [item])

  const requireDigit = useMemo(() => {
    return item?.violations?.find((v) => v.key === 'requireDigit')
  }, [item])

  return (
    <Modal
      title={t('policies_violated.modal.title')}
      open={visible}
      onCancel={onClose}
      width={440}
      footer={false}
    >
      <p className="mb-2">
        {t('policies_violated.modal.description')}
      </p>
      <ul style={{ listStyleType: 'circle', marginLeft: -24 }}>
        {
          !!minLength && <li className="mb-1">
            {t('policies.password_requirements.minimum_password_length', { length: minLength?.value })}
          </li>
        }
        {
          !!requireSpecialCharacter && <li className="mb-1">
            {t('policies.password_requirements.requires_special_character')}
          </li>
        }
        {
          !!requireLowerCase && <li className="mb-1">
            {t('policies.password_requirements.requires_lowercase')}
          </li>
        }
        {
          !!requireUpperCase && <li className="mb-1">
            {t('policies.password_requirements.requires_uppercase')}
          </li>
        }
        {
          !!requireDigit && <li className="mb-1">
            {t('policies.password_requirements.requires_digit')}
          </li>
        }
      </ul>
      <Button
        type="primary"
        className="mt-6 w-full"
        onClick={() => onClose()}
      >
        {t('button.ok')}
      </Button>
    </Modal>
  );
}

export default PasswordViolatedModal;