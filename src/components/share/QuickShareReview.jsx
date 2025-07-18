import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Drawer,
  Button
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import cipherComponents from '../cipher';
import quickShareComponents from '../quick-share';

import common from '../../utils/common';

function QuickShareReview(props) {
  const { SharedWith } = quickShareComponents;
  const CipherName = cipherComponents.Name;
  const {
    visible = false,
    sendId = null,
    onClose = () => {},
  } = props
  const { t } = useTranslation()
  const sends = useSelector((state) => state.share.sends);

  const originSend = useMemo(() => {
    return sends.find((s) => s.id === sendId)
  }, [sends, sendId])

  return (
    <div className={props.className}>
      <Drawer
        title={t('shares.new_share.get_shareable_link')}
        placement="right"
        width={500}
        onClose={onClose}
        open={visible}
        footer={
          <Button
            type="primary"
            className="w-full"
            disabled={!originSend}
            onClick={() => common.copyToClipboard(common.getPublicShareUrl(originSend))}
          >
            { t('button.copy_link') } 
          </Button>
        }
      >
        {
          originSend && <div>
            <CipherName
              send={originSend}
              className="mb-4"
            />
            <div className="flex items-center my-4">
              <p className="font-semibold mr-2">{t('common.receiver')}:</p>
              <SharedWith send={originSend}/>
            </div>
            {
              !originSend.expirationDate ? <p>
                {t('shares.quick_shares.expire_options.no_expiration')}
              </p> : <p>
                {t('shares.quick_shares.expiration_description', { time: common.convertDateTime(originSend.expirationDate, 'DD MMMM, YYYY hh:mm A')})}
              </p>
            }
          </div>
        }
      </Drawer>
    </div>
  );
}

export default QuickShareReview;
