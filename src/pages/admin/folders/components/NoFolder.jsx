import React from "react";

import { useTranslation } from "react-i18next";

import {
  Button,
  Spin
} from '@lockerpm/design';

import {
  PlusOutlined
} from "@ant-design/icons";

import itemsComponents from "../../../../components/items";

const NoFolder = (props) => {
  const { NoData, ImageIcon } = itemsComponents;
  const { t } = useTranslation()
  const {
    className = '',
    loading = false,
    isEmpty = false,
    onCreate = () => { }
  } = props;
  return <Spin spinning={loading}>
    {
      !loading ? <>
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
            <p className="text-sm mt-2 text-black-500">
              {t('inventory.folders.description')}
            </p>
            <Button
              className="mt-6"
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreate}
            >
              {t('inventory.folders.add')}
            </Button>
          </div> : <NoData />
        }
      </> : <div style={{ minHeight: 100 }} />
    }
  </Spin>
}

export default NoFolder;