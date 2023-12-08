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

import CipherIcon from "./table/CipherIcon";
import { gray } from '@ant-design/colors';

const NoCipher = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    loading = false,
    cipherType = null,
    isEmpty = false,
    isTrash = false,
    onCreate = () => { }
  } = props;

  return (
    <Spin spinning={loading}>
      {
        !loading ? <>
          {
            isEmpty ? <div
              className={`text-center ${className}`}
            >
              <CipherIcon
                size={48}
                type={cipherType.type}
                typeKey={cipherType.key}
                isDeleted={isTrash}
              />
              <p className="text-xl font-semibold mt-4">
                {t(`inventory.${cipherType.key}.title`)}
              </p>
              <p className="text-sm mt-2" style={{ color: gray[1] }}>
                {t(`inventory.${cipherType.key}.description`)}
              </p>
              {
                cipherType.key !== 'trash' && <Button
                  className="mt-6"
                  type="primary"
                  ghost
                  onClick={onCreate}
                >
                  {t(`inventory.${cipherType.key}.add`)}
                </Button>
              }
            </div> : <NoData />
          }
        </> : <div style={{ minHeight: 100 }} />
      }
    </Spin>
  );
}

export default NoCipher;