import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
  Spin
} from '@lockerpm/design';

import {
  PlusOutlined
} from "@ant-design/icons";

import { gray } from '@ant-design/colors';

import itemsComponents from "../items";
import commonComponents from "../common";

const NoCipher = (props) => {
  const { NoData } = itemsComponents;
  const { CipherIcon } = commonComponents;
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
                  icon={<PlusOutlined />}
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