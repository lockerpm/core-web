import React, { useState, useEffect } from "react";
import { } from 'react-redux';
import { Trans, useTranslation } from "react-i18next";

import {
  Card,
  Button,
  Spin,
  Form,
  Input
} from '@lockerpm/design';

import {
  KeyOutlined,
  RedoOutlined
} from "@ant-design/icons";

import { green } from '@ant-design/colors';

import global from "../../config/global";
import common from "../../utils/common";

const PasskeyForm = (props) => {
  const { t } = useTranslation()
  const {
    changing = false,
    isLogin = false,
    userInfo = {},
    isAddKey = false,
    accessToken = common.getAccessToken(),
    onConfirm = () => { },
  } = props;

  const [selectedPasskey, setSelectedPasskey] = useState(null)
  const [passkeys, setPasskeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [callingAPI, setCallingAPI] = useState(false)

  const [form] = Form.useForm();

  useEffect(() => {
    if (!isAddKey) {
      getPasskeys();
    }
  }, [isAddKey])

  const getPasskeys = async () => {
    setLoading(true)
    try {
      const passkeys = await service.listAllPasskeys(userInfo.email) || []
      setSelectedPasskey(passkeys[0] || null)
      setPasskeys(passkeys)
    } catch (error) {
      setPasskeys([])
    }
    setLoading(false)
  }

  const getPwl = async () => {
    setCallingAPI(true)
    try {
      const response = await service.getPasswordlessUsingPasskey({
        email: userInfo.email,
        credentialId: selectedPasskey?.credential_id,
        random: selectedPasskey?.random,
      })
      await onConfirm(response)
    } catch (error) {
      global.pushError(error)
    }
    setCallingAPI(false)
  }

  const setBackupPwl = async (values) => {
    setCallingAPI(true)
    await service.setApiToken(accessToken);
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
    <Spin spinning={loading}>
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
            {
              isLogin && <p className={`my-6 text-left`}>
                {t('passwordless.connect_passkey_to_login')}
              </p>
            }
            {
              !isLogin && <p className={`my-6 text-left`}>
                {userInfo?.login_method === 'passwordless' ? t('passwordless.choose_a_key') : t('passwordless.connect_key')}
              </p>
            }
            {
              passkeys.length === 0 && <Card
                bodyStyle={{ padding: '9px 24px' }}
              >
                {t('passwordless.no_key_found')}
              </Card>
            }
            {
              passkeys.map((d, index) => <Card
                className="mt-4 cursor-pointer"
                key={index}
                bodyStyle={{ padding: '9px 24px' }}
                style={{ borderColor: selectedPasskey?.credential_id == d.credential_id ? green[7] : '' }}
                onClick={() => setSelectedPasskey(d)}
              >
                <div className="flex items-center">
                  <KeyOutlined style={{ fontSize: 20 }} />
                  <p className="font-semibold ml-2">
                    {t(d.name)}
                  </p>
                </div>
              </Card>)
            }
            <Button
              className="mt-4 w-full"
              type="text"
              size="large"
              icon={<RedoOutlined />}
              onClick={() => getPasskeys()}
            >
              {t('passwordless.reload_keys')}
            </Button>
            <Button
              className="mt-10 w-full"
              type="primary"
              size="large"
              disabled={!selectedPasskey}
              loading={changing || callingAPI}
              onClick={() => getPwl()}
            >
              {t('button.continue')}
            </Button>
          </div>
        }
      </div>
    </Spin>
  );
}

export default PasskeyForm;