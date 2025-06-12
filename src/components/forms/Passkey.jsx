import React, { useEffect, useState } from "react";
import { } from 'react-redux';
import { Trans, useTranslation } from "react-i18next";

import {
  Button,
  Form,
  Input
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import global from "../../config/global";
import common from "../../utils/common";

const PasskeyForm = (props) => {
  const { t } = useTranslation()
  const {
    changing = false,
    userInfo = {},
    isAddKey = false,
    accessToken = null,
    onConfirm = () => { },
  } = props;

  const [callingAPI, setCallingAPI] = useState(false)

  const [form] = Form.useForm();

  const getPwl = async () => {
    setCallingAPI(true)
    try {
      const response = await service.getPasswordlessUsingPasskeys({
        email: userInfo.email,
      })
      await onConfirm(response)
    } catch (error) {
      global.pushError(error)
    }
    setCallingAPI(false)
  }

  const setBackupPwl = async (values) => {
    setCallingAPI(true)
    const apiToken = accessToken || await common.getAccessToken();
    await service.setApiToken(apiToken);
    const encKey = await global.jsCore.cryptoService.getEncKey();
    await service.setBackupPasswordlessUsingPasskey({
      email: userInfo.email,
      name: userInfo.name,
      currentEncKey: encKey.key,
      passkeyName: values.passkeyName
    }).then(() => {
      onConfirm();
    }).catch((error) => {
      global.pushError(error);
    });
    setCallingAPI(false);
  }

  return (
    <div className="passwordless-form">
      {
        isAddKey && <div>
          <div className="mb-2">
            <Trans
              i18nKey={'security.passkey.add_new_key_note'}
              components={{
                b: <b className="font-semibold"></b>
              }}
            />
          </div>
          <Form
            form={form}
            layout="vertical"
            disabled={callingAPI}
            onFinish={setBackupPwl}
          >
            <Form.Item
              name={'passkeyName'}
              disabled={callingAPI}
              label={t('security.passkey.add_new_key_description')}
              rules={[
                global.rules.REQUIRED(t('common.name')),
              ]}
            >
              <Input
                size="large"
                autoFocus={true}
                placeholder={t('placeholder.enter')}
              />
            </Form.Item>
            <Button
              className="w-full"
              type="primary"
              size="large"
              loading={changing || callingAPI}
              htmlType="submit"
            >
              {t('button.continue')}
            </Button>
          </Form>
        </div>
      }
      {
        !isAddKey && <div>
          <Button
            className="w-full"
            type="primary"
            size="large"
            loading={changing || callingAPI}
            onClick={() => getPwl()}
          >
            {t('button.continue')}
          </Button>
        </div>
      }
    </div>
  );
}

export default PasskeyForm;