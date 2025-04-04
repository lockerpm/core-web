/* eslint-disable no-import-assign */
import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Form,
  Button,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import formsComponents from "../../../components/forms";
import itemsComponents from "../../../components/items";
import lockComponents from "./lock";

import commonServices from "../../../services/common";

const LockForm = (props) => {
  const { t } = useTranslation();
  const { UserInfo  } = itemsComponents;
  const { Pairing, SecurityKey, Passkey } = formsComponents;
  const { UnlockTitle, MPForm, UnlockWith } = lockComponents;

  const {
    step,
    isPair,
    logging,
    loading,
    callingAPI,
    serviceUser,
    otherMethod,
    isShowMPHint,
    setStep = () => {},
    setIsPair = () => {},
    setServiceUser = () => {},
    setOtherMethod = () => {},
    setMPHintVisible = () => {},
    onSubmit = () => {},
    onLogout = () => {}
  } = props;
  
  const isConnected = useSelector((state) => state.service.isConnected)
  const locale = useSelector((state) => state.system.locale);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [form] = Form.useForm();

  const showMpForm = useMemo(() => {
    if (userInfo?.email && userInfo?.is_require_passwordless) {
      return !(userInfo?.passkeys.length > 0 || userInfo?.security_keys?.length > 0)
    }
    return true
  }, [userInfo])

  const isUnlockWith = useMemo(() => {
    return userInfo?.passkeys.length > 0 || userInfo?.security_keys.length > 0 || userInfo?.sync_all_platforms
  }, [userInfo])

  const selectOtherMethod = (method) => {
    setStep(2);
    setOtherMethod(method);
    if (method === 'security_key') {
      setIsPair(!isConnected || !service.pairingService?.hasKey);
    } else {
      setIsPair(false)
    }
  }

  const handleUnlock = async () => {
    if (serviceUser) {
      await onSubmit(serviceUser)
    } else {
      form.validateFields().then(async (values) => {
        await onSubmit(values)
      })
    }
  }

  const handlePairConfirm = async () => {
    setIsPair(false)
    if (userInfo?.sync_all_platforms) {
      try {
        const serviceUser = await service.getCurrentUser();
        if (serviceUser?.email === userInfo.email) {
          const cacheData = await service.getCacheData();
          setOtherMethod(cacheData?.unlock_method || null);
          setServiceUser(serviceUser)
          await onSubmit({
            ...serviceUser,
            unlock_method: cacheData?.unlock_method
          })
        }
      } catch (error) {
        await commonServices.reset_service();
      }
    }
  }

  return (
    <>
      <UnlockTitle
        step={step}
        otherMethod={otherMethod}
        showMpForm={showMpForm}
        callingAPI={callingAPI}
        setStep={setStep}
        setIsPair={setIsPair}
        setOtherMethod={setOtherMethod}
      />
      <Form
        form={form}
        key={locale}
      >
        <div className="mt-6 mb-10 flex items-center justify-center">
          <UserInfo />
        </div>
        <div>
          {
            isPair && <div>
              <Pairing
                userInfo={userInfo}
                callingAPI={callingAPI}
                onConfirm={() => handlePairConfirm()}
              />
              <div className="mt-8 flex flex-col gap-2">
                <Button
                  className="w-full"
                  type="primary"
                  ghost
                  size="large"
                  onClick={() => {
                    setIsPair(false);
                    setStep(1);
                  }}
                >
                  {t('button.use_mp_instead')}
                </Button>
                <Button
                  className="w-full"
                  size="large"
                  loading={logging}
                  onClick={() => onLogout()}
                >
                  {t('sidebar.logout')}
                </Button>
              </div>
            </div>
          }
          {
            !isPair && <div>
              {
                !!serviceUser && <div>
                  <Button
                    className="w-full"
                    size="large"
                    type="primary"
                    htmlType="submit"
                    disabled={logging}
                    loading={callingAPI}
                    onClick={onUnlock}
                  >
                    {t('lock.unlock')}
                  </Button>
                  <Button
                    className="w-full"
                    size="large"
                    disabled={callingAPI}
                    loading={logging}
                    onClick={onLogout}
                  >
                    {t('sidebar.logout')}
                  </Button>
                </div>
              }
              {
                !serviceUser && <div>
                  {
                    step === 1 && <div>
                      {
                        showMpForm && <MPForm
                          logging={logging}
                          callingAPI={callingAPI}
                          isShowMPHint={isShowMPHint}
                          onUnlock={handleUnlock}
                          setMPHintVisible={setMPHintVisible}
                        />
                      }
                      {
                        isUnlockWith && <UnlockWith
                          loading={loading}
                          userInfo={userInfo}
                          callingAPI={callingAPI}
                          setIsPair={setIsPair}
                          selectOtherMethod={selectOtherMethod}
                        />
                      }
                      {
                        !callingAPI && <Button
                          className={`w-full ${isUnlockWith ? 'mt-8' : 'mt-2'}`}
                          size="large"
                          loading={logging}
                          onClick={onLogout}
                        >
                          {t('sidebar.logout')}
                        </Button>
                      }
                    </div>
                  }
                  {
                    step === 2 && <div>
                      {
                        otherMethod === 'security_key' && <SecurityKey
                          changing={callingAPI}
                          userInfo={userInfo}
                          onRepair={() => setIsPair(true)}
                          onConfirm={(password) => onSubmit({
                            password
                          })}
                        />
                      }
                      {
                        otherMethod === 'passkey' && <Passkey
                          changing={loading}
                          userInfo={userInfo}
                          onConfirm={(password) => onSubmit({
                            password
                          })}
                        />
                      }
                      {
                        !callingAPI && <Button
                          className="w-full mt-8"
                          size="large"
                          loading={logging}
                          onClick={() => onLogout()}
                        >
                          {t('sidebar.logout')}
                        </Button>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      </Form>
    </>
  );
}

export default LockForm;