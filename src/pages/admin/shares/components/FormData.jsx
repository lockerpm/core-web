import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Form,
  Space,
  Button,
  Drawer,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import ShareOption from './form-data/ShareOption';

function FormData(props) {
  const {
    visible = false,
    menuTypes = {},
    menuType = null,
    item = null,
    onClose = () => {},
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [step, setStep] = useState(1);
  const [callingAPI, setCallingAPI] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        option: menuType || menuTypes.CIPHERS
      })
    } else {
      form.resetFields();
      setCallingAPI(false);
    }
  }, [visible, item, menuType])

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
    <div className={props.className}>
      <Drawer
        title={t('shares.no_data.add')}
        placement="right"
        width={500}
        closable={step === 1}
        onClose={step === 1 ? onClose : () => {}}
        open={visible}
        footer={
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
                { t('button.save') } 
              </Button>
            }
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          labelAlign={'left'}
        >
          {
            step === 1 && <ShareOption menuTypes={menuTypes}/>
          }
        </Form>
      </Drawer>
    </div>
  );
}

export default FormData;
