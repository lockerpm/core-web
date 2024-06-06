import React, { useMemo, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import {
} from '@lockerpm/design';
import {
  ArrowLeftOutlined
} from "@ant-design/icons";

import commonComponents from "../../../components/common";
import itemsComponents from "../../../components/items";
import cipherComponents from "../../../components/cipher";
import quickShareComponents from "../../../components/quick-share";

import commonServices from "../../../services/common";

import common from "../../../utils/common";
import global from "../../../config/global";

const QuickShareDetail = () => {
  const { t } = useTranslation();
  const { PageHeader, CipherIcon } = commonComponents;
  const { RouterLink } = itemsComponents;
  const { DetailList } = cipherComponents;
  const { Actions } = quickShareComponents;
  const location = useLocation();

  const currentPage = common.getRouterByLocation(location);
  const sends = useSelector((state) => state.share.sends);

  const send = useMemo(() => {
    return sends.find((c) => c.id === currentPage.params?.id) || {}
  }, [currentPage, sends])

  const sendCipher = useMemo(() => {
    return send.cipher
  }, [currentPage, sends])

  const stopSharingItem = async (item) => {
    try {
      await commonServices.stop_quick_share(item)
      global.pushSuccess(t('notification.success.sharing.stop_share_success'))
      global.navigate(global.keys.MY_SHARED_ITEMS, {}, { menu_type: global.constants.MENU_TYPES.QUICK_SHARES })
    } catch (error) {
      global.pushError(error)
    }
  }

  return (
    <>
      {
        sendCipher && <div
          className="quick-share-detail layout-content"
          onScroll={(e) => common.scrollEnd(e, {}, 0)}
        >
          <PageHeader
            title={sendCipher?.name}
            subtitle={common.cipherSubtitle(sendCipher)}
            actions={[]}
            Logo={() => <div className="flex items-center">
              <RouterLink
                className={'font-semibold'}
                label={''}
                routerName={global.keys.MY_SHARED_ITEMS}
                routerParams={{}}
                routerQuery={{ menu_type: global.constants.MENU_TYPES.QUICK_SHARES }}
                icon={<ArrowLeftOutlined />}
              />
              <CipherIcon
                className="mx-4"
                size={48}
                item={sendCipher}
                type={sendCipher.type}
                isDeleted={sendCipher?.isDeleted}
              />
            </div>}
            Right={() => <Actions
              size="medium"
              item={send}
              onStopSharing={stopSharingItem}
            />}
          />
          <DetailList
            className="mt-4"
            cipher={sendCipher}
          />
        </div>
      }
    </>
  );
}

export default QuickShareDetail;