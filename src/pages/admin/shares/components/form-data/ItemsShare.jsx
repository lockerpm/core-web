import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Form,
  Select,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { useSelector  } from 'react-redux';
import { useTranslation } from "react-i18next";

import common from '../../../../../utils/common';

function ItemsShare(props) {
  const {
    item = null
  } = props
  const { t } = useTranslation()

  const allCiphers = useSelector((state) => state.cipher.allCiphers);

  const [cipherSearchText, setCipherSearchText] = useState('')

  const cipherOptions = useMemo(() => {
    return allCiphers
      .filter((c) => !c.delete && common.isCipherQuickShareable(c))
      .filter((c) => c.name?.toLowerCase().includes(cipherSearchText))
      .map((c) => ({ label: c.name, value: c.id }))
  }, [allCiphers, cipherSearchText])

  return (
    <div>
      <Form.Item
        name={'items'}
        className='mb-2'
        label={
          <div>
            <p className='font-semibold'>
              {t('shares.new_share.choose_items')}
            </p>
            <span>
              {t('shares.new_share.choose_items_note')}
            </span>
          </div>
        }
        rules={[]}
      >
        <Select
          placeholder={t('shares.new_share.search_inventory')}
          mode={'multiple'}
          disabled={!!item}
          filterOption={false}
          showSearch={true}
          options={cipherOptions}
          onSearch={(v) => setCipherSearchText(v)}
        />
      </Form.Item>
    </div>
  );
}

export default ItemsShare;
