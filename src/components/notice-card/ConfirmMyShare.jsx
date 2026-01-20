import React from 'react';
import { useTranslation } from "react-i18next";

import {
  Card,
  Button
} from '@lockerpm/design';

import {
  ArrowRightOutlined,
  CloseOutlined
} from "@ant-design/icons";

import global from '../../config/global';
import storeActions from '../../store/actions';

function ConfirmMyShare() {
  const { t } = useTranslation();
  return (
    <div className="p-4 md:px-8 confirm-my-share">
      <Card>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between'>
            <p>
              {t('notice.confirm_my_share.description')}
            </p>
            <Button
              type='text'
              size='small'
              icon={<CloseOutlined />}
              onClick={() => {
                global.store.dispatch(storeActions.updateConfirmMyShareVisible(false))
              }}
            />
          </div>
          <div>
            <Button
              type='primary'
              ghost
              className='font-semibold'
              onClick={() => {
                global.store.dispatch(storeActions.updateConfirmMyShareVisible(false))
                global.navigate(global.keys.MY_SHARED_ITEMS, {}, { menu_type: global.constants.MENU_TYPES.CIPHERS });
              }}
            >
              {t('notice.confirm_my_share.button')}
              <ArrowRightOutlined />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ConfirmMyShare;
