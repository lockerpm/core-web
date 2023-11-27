import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Form,
  Space,
  Button,
  Drawer,
  Input
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import { PairingForm, PasswordlessForm } from '../../../../../../components';

import global from '../../../../../../config/global';

function FormData(props) {
  const {
    visible = false,
    onClose = () => {},
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);
  const [devices, setDevices] = useState([]);

  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (visible) {
      getDeviceList()
    }
  }, [visible])

  const getDeviceList = async () => {
    try {
      const res = await service.getFidoDeviceList()
      console.log(res);
    } catch (error) {
      // console.log(error)
    }
  }

  useEffect(() => {
    form.resetFields();
    setCallingAPI(false);
  }, [visible])


  const handleSave = async () => {
  }

  return (
    <div className={props.className}>
      <Drawer
        title={userInfo.is_passwordless ? t('security.passwordless.turn_off') : t('security.passwordless.turn_on')}
        placement="right"
        onClose={onClose}
        open={visible}
        width={500}
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
            { t('button.save') } 
            </Button>
          </Space>
        }
      >
        <PairingForm />
        <PasswordlessForm />
      </Drawer>
    </div>
  );
}

export default FormData;
