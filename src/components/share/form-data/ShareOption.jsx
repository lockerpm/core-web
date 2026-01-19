import React from 'react';
import { useTranslation } from "react-i18next";

import {
  Form,
  Radio
} from '@lockerpm/design';

function ShareOption(props) {
  const {
    menuTypes = {},
    menuType = null,
    onChange = () => {}
  } = props
  const { t } = useTranslation()

  return (
    <div className={props.className}>
      <Form.Item
        label={
          <p className='font-semibold'>
            {t('shares.new_share.choose_option')}
          </p>
        }
      >
        <Radio.Group
          name="radiogroup"
          value={menuType}
          onChange={(e) => onChange(e.target.value)}
        >
          <Radio value={menuTypes.CIPHERS} className='mb-2'>
            <div>
              <p className='font-semibold'>{t('shares.new_share.in_app_share_items')}</p>
              <p>{t('shares.new_share.in_app_share_items_note')}</p>
            </div>
          </Radio>
          <Radio value={menuTypes.FOLDERS} className='mb-2'>
            <div>
              <p className='font-semibold'>{t('shares.new_share.in_app_share_folder')}</p>
              <p>{t('shares.new_share.in_app_share_folder_note')}</p>
            </div>
          </Radio>
          <Radio value={menuTypes.QUICK_SHARES}>
            <div>
              <p className='font-semibold'>{t('shares.new_share.quick_shares')}</p>
              <p>{t('shares.new_share.get_shareable_link_note')}</p>
            </div>
          </Radio>
        </Radio.Group>
      </Form.Item>
    </div>
  );
}

export default ShareOption;
