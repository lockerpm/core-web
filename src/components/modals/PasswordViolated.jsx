import React, { useMemo } from "react";

import { useTranslation } from "react-i18next";

import {
  Modal,
  Button,
} from '@lockerpm/design';

const PasswordViolatedModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    callingAPI = false,
    isForm = false,
    item = { violations: [] },
    onOk = () => {},
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
      {
        isForm && <div className="w-full mt-6">
          <Button
            type="primary"
            className="w-full"
            disabled={callingAPI}
            onClick={() => onClose()}
          >
            {t('policies_violated.modal.change_password')}
          </Button>
          <Button
            type="primary"
            ghost
            className="mt-2 w-full"
            loading={callingAPI}
            onClick={() => onOk()}
          >
            {t('policies_violated.modal.still_use_this_password')}
          </Button>
        </div>
      }
      {
        !isForm && <Button
          type="primary"
          className="mt-6 w-full"
          onClick={() => onClose()}
        >
          {t('button.ok')}
        </Button>
      }
    </Modal>
  );
}

export default PasswordViolatedModal;