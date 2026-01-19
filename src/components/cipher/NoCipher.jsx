import React from "react";
import { useTranslation } from "react-i18next";

import {
  Button,
  Spin,
} from '@lockerpm/design';

import {
  PlusOutlined,
  ImportOutlined
} from "@ant-design/icons";

import itemsComponents from "../items";
import commonComponents from "../common";

import global from "../../config/global";

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
              <p className="text-sm mt-2 text-black-500">
                {t(`inventory.${cipherType.key}.description`)}
              </p>
              {
                cipherType.key !== 'trash' && <div className="flex items-center justify-center mt-6">
                  <Button
                    className="mr-2"
                    type="primary"
                    icon={<ImportOutlined />}
                    ghost
                    onClick={() => {
                      global.navigate(global.keys.SETTINGS_IMPORT_EXPORT, {}, { is_import: 1 })
                    }}
                  >
                    {t('button.import')}
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onCreate}
                  >
                    {t(`inventory.${cipherType.key}.add`)}
                  </Button>
                </div>
              }
            </div> : <NoData />
          }
        </> : <div style={{ minHeight: 100 }} />
      }
    </Spin>
  );
}

export default NoCipher;