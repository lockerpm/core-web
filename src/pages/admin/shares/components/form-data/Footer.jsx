import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Space,
  Button,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

function FormData(props) {
  const {
    form = null,
    step = 1,
    callingAPI = false,
    setStep = () => {},
    onClose = () => {},
    setCallingAPI = () => {}
  } = props
  const { t } = useTranslation()

  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      setCallingAPI(false);
      onClose();
    })
  }

  const handleContinue = () => {
    setStep(step + 1)
  }

  return (
    <Space className='flex items-center justify-end'>
      {
        step === 1 && <Button
          disabled={callingAPI}
          onClick={onClose}
        >
          {t('button.cancel')}
        </Button>
      }
      {
        step !== 1 && <Button
          disabled={callingAPI}
          onClick={() => setStep(step - 1)}
        >
          {t('button.back')}
        </Button>
      }
      {
        step === 1 && <Button
          type="primary"
          loading={callingAPI}
          onClick={handleContinue}
        >
          { t('button.continue') } 
        </Button>
      }
      {
        step === 2 && <Button
          type="primary"
          loading={callingAPI}
          onClick={handleSave}
        >
          { t('button.share') } 
        </Button>
      }
    </Space>
  );
}

export default FormData;
