import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import {
  Button,
  Form,
  Input
} from '@lockerpm/design';

import coreServices from "../../services/core";

import global from "../../config/global";
import common from "../../utils/common";

const PasskeyForm = (props) => {
  const { t } = useTranslation()
  const {
    changing = false,
    userInfo = {},
    isAddKey = false,
    isNewKey = false,
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
    try {
      const makeKey = await coreServices.make_key(
        userInfo.email,
        values.masterPassword,
        userInfo.kdf,
        userInfo.kdf_iterations,
        userInfo.kdf_memory,
        userInfo.kdf_parallelism
      )
      const mainMasterPasswordHash = await global.jsCore.cryptoService.hashPassword(values.masterPassword, makeKey)
      await common.serviceSetApiToken();
      const encKey = await global.jsCore.cryptoService.getEncKey();
      await service.setBackupPasswordlessUsingPasskey({
        email: userInfo.email,
        name: userInfo.name,
        currentEncKey: encKey.key,
        mainMasterPasswordHash,
        passkeyName: values.passkeyName
      })
      onConfirm();
    } catch (error) {
      global.pushError(error);
    }
    setCallingAPI(false);
  }

  const setNewPwl = async (values) => {
    setCallingAPI(true)
    await common.serviceSetApiToken();
    await service.setNewPasswordlessUsingPasskey({
      email: userInfo.email,
      name: userInfo.name,
      passkeyName: values.passkeyName
    }).then((response) => {
      onConfirm(response);
    }).catch((error) => {
      global.pushError(error);
    });
    setCallingAPI(false);
  }

  return (
    <div className="passwordless-form">
      {
        isAddKey && <div>
          {
            !isNewKey && <div className="mb-2">
              <Trans
                i18nKey={'security.passkey.add_new_key_note'}
                components={{
                  b: <b className="font-semibold"></b>
                }}
              />
            </div>
          }
          <Form
            form={form}
            layout="vertical"
            disabled={callingAPI}
            onFinish={isNewKey ? setNewPwl : setBackupPwl}
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
            {
              !isNewKey && <Form.Item
                name={'masterPassword'}
                label={t('lock.master_password')}
                rules={[
                  global.rules.REQUIRED(t('lock.master_password')),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder={t('placeholder.enter')}
                />
              </Form.Item>
            }
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