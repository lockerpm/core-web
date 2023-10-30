import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Form,
  Space,
  Button,
  Drawer,
  Input,
  Steps,
  Collapse
} from '@lockerpm/design';

import QRCode from "react-qr-code";

import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { Trans, useTranslation } from "react-i18next";

import global from '../../../../../../config/global';

function TwoFAFormData(props) {
  const {
    visible = false,
    onClose = () => {},
  } = props
  const { t } = useTranslation()
  const factor2 = useSelector((state) => state.auth.factor2);

  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);
  const [otp, setOtp] = useState('')

  const smartOtp = useMemo(() => {
    return factor2?.user_factor2_infos?.find((i) => i.method === 'smart_otp')
  }, [factor2])

  useEffect(() => {
    form.resetFields();
    setCallingAPI(false);
  }, [visible])


  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      setCallingAPI(false);
      onClose();
    })
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t('security.two_fa.title')}
        placement="right"
        onClose={onClose}
        open={visible}
        footer={
          <Space className='flex items-center justify-end'>
            <Button
              disabled={callingAPI}
              onClick={onClose}
            >
              {t('button.cancel')}
            </Button>
            <Button
              type="primary"
              loading={callingAPI}
              onClick={handleSave}
            >
              { t('button.enable') } 
            </Button>
            <Button
              type="primary"
              loading={callingAPI}
              onClick={handleSave}
            >
              { t('button.disable') } 
            </Button>
          </Space>
        }
      >
        <p className='mb-2'>{t('security.two_fa.description')}</p>
        {
          !smartOtp?.is_active && <div>
            <Steps
              direction="vertical"
              className="steps-2fa"
              items={[1, 2, 3, 4].map((step) => ({
                status: 'process',
                title: <Collapse
                  ghost={true}
                  expandIconPosition={'end'}
                  defaultActiveKey={["1"]}
                >
                  <Collapse.Panel
                    header={<p className="font-semibold">
                      {t(`2fa.step${step}.title`)}
                    </p>}
                    key="1"
                  >
                    {
                      step !== 2 ? t(`2fa.step${step}.description`) : <Trans
                        i18nKey={`2fa.step${step}.description`}
                        values={{
                          key: smartOtp?.secret,
                        }}
                        components={{
                          key: <b/>
                        }}
                      />
                    }
                  </Collapse.Panel>
                </Collapse>,
              }))}
            />
            <div className="mb-4"> 
              <QRCode
                size={200}
                level="H"
                value={smartOtp?.uri || 'dsvdsdvds'}
              />
            </div>
          </div>
        }
        <p className="font-semibold">
          {t('2fa.enter_code')}
        </p>
        <Input
          value={otp}
          className="mt-2"
          placeholder={t('placeholder.code')}
          disabled={callingAPI}
          onChange={(e) => setOtp(e.target.value)}
        />
      </Drawer>
    </div>
  );
}

export default TwoFAFormData;
