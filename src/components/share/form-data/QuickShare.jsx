import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Row,
  Col,
  Form,
  Select,
  InputNumber
} from '@lockerpm/design';

import commonComponents from '../../common';;

import common from '../../../utils/common';
import global from '../../../config/global';

function QuickShare(props) {
  const { ItemInput } = commonComponents;
  const {
    item,
    form,
    expirationOptions = {},
    countAccessOptions = {},
    shareWithOptions = {}
  } = props
  const { t } = useTranslation();

  const allCiphers = useSelector((state) => state.cipher.allCiphers);

  const [cipherSearchText, setCipherSearchText] = useState('')

  const countAccess = Form.useWatch('countAccess', form)
  const requireOtp = Form.useWatch('requireOtp', form)

  const cipherOptions = useMemo(() => {
    return allCiphers
      .filter((c) => !c.delete && common.isCipherQuickShareable(c))
      .filter((c) => c.name?.toLowerCase().includes(cipherSearchText))
      .map((c) => ({ label: c.name, value: c.id }))
  }, [allCiphers, cipherSearchText])

  return (
    <div className='quick-share'>
      <Form.Item
        name={'cipherId'}
        label={
          <p className='font-semibold'>
            {t('shares.quick_shares.choose_an_item')}
          </p>
        }
        rules={[
          global.rules.REQUIRED(t('common.item'))
        ]}
      >
        <Select
          placeholder={t('shares.new_share.search_inventory')}
          filterOption={false}
          showSearch={true}
          options={cipherOptions}
          disabled={!!item}
          onSearch={(v) => setCipherSearchText(v)}
        />
      </Form.Item>
      <Form.Item
        name={'requireOtp'}
        label={
          <p className='font-semibold'>
            {t('shares.quick_shares.share_with')}
          </p>
        }
      >
        <Select
          placeholder={t('placeholder.select')}
          options={[
            {
              value: shareWithOptions.ANYONE,
              label: t('shares.quick_shares.anyone_with_the_link')
            },
            {
              value: shareWithOptions.ONLY_SOME,
              label: t('shares.quick_shares.only_invited_people')
            }
          ]}
        />
      </Form.Item>
      {
        requireOtp === shareWithOptions.ONLY_SOME && <Form.Item
          className='mb-2'
          name={'emails'}
          label={
            <div>
              <p className='font-semibold'>
                {t('shares.quick_shares.email_addresses_share')}
              </p>
              <span className='text-xs'>
                {t('shares.new_share.personal_email_note')}
              </span>
            </div>
          }
          rules={[
            {
              validator: (_, value) =>
                value?.length > 0 ? Promise.resolve() : Promise.reject(new Error(t('validation.required', { name: t('common.email_addresses') }))),
            },
          ]}
        >
          <ItemInput
            type="email"
            note={t('shares.quick_shares.email_addresses_share_note')}
          />
        </Form.Item>
      }
      <div>
        <p className='font-semibold mb-1'>
          {t('shares.quick_shares.link_expires_after')}
        </p>
        <Row gutter={[8, 8]}>
          <Col span={8}>
            <Form.Item
              name={'expireAfter'}
              rules={[]}
              noStyle
            >
              <Select
                placeholder={t('placeholder.select')}
                className='w-full'
                options={[
                  {
                    value: expirationOptions.AN_HOUR,
                    label: t('shares.quick_shares.expire_options.an_hour')
                  },
                  {
                    value: expirationOptions.A_DAY,
                    label: t('shares.quick_shares.expire_options.a_day')
                  },
                  {
                    value: expirationOptions.A_WEEK,
                    label: t('shares.quick_shares.expire_options.a_week')
                  },
                  {
                    value: expirationOptions.DAYS,
                    label: t('shares.quick_shares.expire_options.two_weeks')
                  },
                  {
                    value: expirationOptions.A_MONTH,
                    label: t('shares.quick_shares.expire_options.a_month')
                  },
                  {
                    value: expirationOptions.NO_EXPIRATION,
                    label: t('shares.quick_shares.expire_options.no_expiration')
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={2} className='text-center'>
            {t('common.or')}
          </Col>
          {
            !!countAccess && <Col span={6}>
              <Form.Item
                name={'maxAccessCount'}
                rules={[]}
                noStyle
              >
                <InputNumber
                  className='w-full'
                  placeholder={t('placeholder.enter')}
                />
              </Form.Item>
            </Col>
          }
          <Col span={8}>
            <Form.Item
              name={'countAccess'}
              rules={[]}
              noStyle
            >
              <Select
                placeholder={t('placeholder.select')}
                className='w-full'
                options={[
                  {
                    value: countAccessOptions.UNLIMITED,
                    label: t('shares.quick_shares.unlimited_access')
                  },
                  {
                    value: countAccessOptions.TIMES_ACCESS,
                    label: t('shares.quick_shares.times_access')
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default QuickShare;
