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

const NoFolder = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    loading = false,
    isEmpty = false,
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
                name="folder"
                width={48}
                height={48}
              />
              <p className="text-xl font-semibold mt-4">
                {t('inventory.folders.title')}
              </p>
              <p className="text-sm mt-2" style={{ color: gray[1] }}>
                {t('inventory.folders.description')}
              </p>
              <Button
                className="mt-6"
                type="primary"
                ghost
                onClick={onCreate}
              >
                {t('inventory.folders.add')}
              </Button>
            </div> : <NoData />
          }
        </>
      }
    </Spin>
  );
}

export default NoFolder;