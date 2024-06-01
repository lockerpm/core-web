import React, { useState, useEffect } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Card,
  Button,
  Spin,
} from '@lockerpm/design';

import {
  KeyOutlined,
  RedoOutlined
} from "@ant-design/icons";

import { green } from '@ant-design/colors';

import global from "../../config/global";

const PasskeyForm = (props) => {
  const { t } = useTranslation()
  const {
    changing = false,
    isLogin = false,
    userInfo = {},
    onConfirm = () => { },
  } = props;

  const [selectedPasskey, setSelectedPasskey] = useState(null)
  const [passkeys, setPasskeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [callingAPI, setCallingAPI] = useState(false)

  useEffect(() => {
    getPasskeys();
  }, [])

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

  return (
    <Spin spinning={loading}>
      <div className="passwordless-form text-center">
        <div>
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
      </div>
    </Spin>
  );
}

export default PasskeyForm;