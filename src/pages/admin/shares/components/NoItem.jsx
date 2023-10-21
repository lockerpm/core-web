import React, { } from "react";
import {
  Button,
  Spin
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  NoData,
  ImageIcon
} from '../../../../components';

import { gray } from '@ant-design/colors';

const NoCipher = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    loading = false,
    isEmpty = false,
    isSharedWithMe = true,
    isQuickShares = false,
    onCreate = () => {}
  } = props;
  return (
    <Spin spinning={loading} style={{ minHeight: 100 }}>
      {
        !loading && <>
          {
            isEmpty ? <div
              className={`text-center ${className}`}
            >
              <ImageIcon
                name="shares"
                width={48}
                height={48}
              />
              <p className="text-xl font-semibold mt-4">
                {t('shares.no_data.title')}
              </p>
              <p className="text-sm mt-2" style={{ color: gray[1] }}>
                {t(`shares.no_data.${isQuickShares ? 'quick_share_description' : 'description'}`)}
              </p>
              {
                !isSharedWithMe && <Button
                  className="mt-6"
                  type="primary"
                  ghost
                  onClick={onCreate}
                >
                  {t('shares.no_data.add')}
                </Button>
              }
            </div> : <NoData />
          }
        </>
      }
    </Spin>
  );
}

export default NoCipher;