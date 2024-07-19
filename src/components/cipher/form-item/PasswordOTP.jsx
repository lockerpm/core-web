import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Form,
  Select,
  Input,
  Button,
  Tooltip,
} from '@lockerpm/design';

import {
  CloseOutlined
} from '@ant-design/icons';

import commonComponents from '../../common';

import { CipherType } from '../../../core-js/src/enums';

import global from '../../../config/global';
import common from '../../../utils/common';

const options = {
  NO_OTP: 'no_otp',
  NEW_OTP: 'new_otp',
  EXISTING_OTP: 'existing_otp'
}

function PasswordOTP(props) {
  const { DisplayOtp } = commonComponents;
  const {
    form,
    item,
    visible,
    disabled = false,
    otpLimited = false,
    setIsCreateOtp = () => {},
  } = props
  const { t } = useTranslation();
  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const [isEdit, setIsEdit] = useState(false)
  const [option, setOption] = useState('')
  const [otps, setOtps] = useState([])
  const [searchText, setSearchText] = useState('')
  const [totp, setTotp] = useState('')

  useEffect(() => {
    setSearchText('')
    if (item?.login?.totp) {
      setIsEdit(true)
      setTotp(item?.login?.totp)
      setOption('')
    } else {
      setIsEdit(false)
      setTotp('')
      setOption(options.NO_OTP)
    }
  }, [visible, item])

  useEffect(() => {
    fetchCiphers();
  }, [searchText])

  const fetchCiphers = async () => {
    const result = await common.listCiphers({
      deleted: false,
      searchText: searchText,
      filters: [(c) => c.type === CipherType.TOTP]
    }, allCiphers)
    setOtps(result);
  }

  const handleChangeOption = (v) => {
    if (v === options.NEW_OTP) {
      setIsCreateOtp(true)
    } else {
      setIsCreateOtp(false)
    }
    setOption(v)
    setTotp('')
    form.setFieldValue('totp', null)
  }

  return (
    <div className={props.className}>
      <p className='font-semibold mb-2'>
        {t('cipher.password.setup_otp')}
      </p>
      {
        !isEdit && <Select
          className='w-full'
          disabled={disabled}
          value={option}
          onChange={handleChangeOption}
          options={[
            {
              value: options.NO_OTP,
              label: t('cipher.password.no_otp')
            },
            {
              value: options.NEW_OTP,
              label: <Tooltip
                title={otpLimited ? t('cipher.otp.limited') : ''}
                placement='right'
              >
                <span>{t('cipher.password.new_otp')}</span>
              </Tooltip>,
              disabled: otpLimited
            },
            {
              value: options.EXISTING_OTP,
              label: t('cipher.password.existing_otp')
            }
          ]}
        />
      }
      {
        option === options.EXISTING_OTP && <Form.Item
          name={'totp'}
          className='mb-2'
          label={
            <p className='text-gray'>{t('cipher.password.select_otp')}</p>
          }
          rules={[
            global.rules.REQUIRED(t('cipher.otp.name'))
          ]}
        >
          <Select
            className='w-full'
            disabled={disabled}
            placeholder={t('placeholder.select')}
            options={otps.map((otp) => ({ label: otp.name, value: otp.notes }))}
            onChange={(v) => setTotp(v)}
          />
        </Form.Item>
      }
      {
        option === options.NEW_OTP && <Form.Item
          name={'totp'}
          className='mb-2'
          label={
            <p className='text-gray'>{t('cipher.password.secret_key')}</p>
          }
          rules={[
            global.rules.REQUIRED(t('cipher.otp.secret_key'))
          ]}
        >
          <Input.Password
            className='w-full'
            disabled={disabled}
            placeholder={t('placeholder.enter')}
            onChange={(e) => setTotp(e.target.value)}
          />
        </Form.Item>
      }
      {
        totp && <div className='flex items-center justify-between'>
          <DisplayOtp notes={totp}/>
          <Button
            type={'text'}
            disabled={disabled}
            danger
            icon={<CloseOutlined />}
            onClick={() => {
              setOption(options.NO_OTP)
              setIsEdit(false);
              setTotp('');
            }}
          ></Button>
        </div>
      }
    </div>
  );
}

export default PasswordOTP;
