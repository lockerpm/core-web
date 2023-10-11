import React, { } from "react";
import {
  Button,
  Spin
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import common from "../../../../utils/common";

import {
  NoData
} from '../../../../components';

import CipherIcon from "./CipherIcon";
import { gray } from '@ant-design/colors';

const NoCipher = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    loading = false,
    type = null,
    isEmpty = false,
    onCreate = () => {}
  } = props;
  const cipherType = common.cipherTypeInfo('type', type)
  return (
    <Spin spinning={loading} style={{ minHeight: 100 }}>
      {
        !loading && <>
          {
            isEmpty ? <div
              className={`text-center ${className}`}
            >
              <CipherIcon
                size={48}
                type={type}
              />
              <p className="text-xl font-semibold mt-4">
                {t(`inventory.${cipherType.key}.title`)}
              </p>
              <p className="text-sm mt-2" style={{ color: gray[1] }}>
                {t(`inventory.${cipherType.key}.description`)}
              </p>
              <Button
                className="mt-6"
                type="primary"
                ghost
                onClick={onCreate}
              >
                {t(`inventory.${cipherType.key}.add`)}
              </Button>
            </div> : <NoData />
          }
        </>
      }
    </Spin>
  );
}

export default NoCipher;