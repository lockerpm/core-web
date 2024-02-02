import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import {
  Tag
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../items";
import commonComponents from "../common";

import common from "../../utils/common";
import global from "../../config/global";

const { TextCopy, RouterLink, ImageIcon } = itemsComponents;
const { CipherIcon } = commonComponents;

const Name = (props) => {
  const { t } = useTranslation()
  const location = useLocation();

  const {
    cipher = {},
    send = null
  } = props;
  const currentPage = common.getRouterByLocation(location);
  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const originCipher = useMemo(() => {
    if (send) {
      return allCiphers.find((d) => d.id === send?.cipherId) || send.cipher
    }
    return allCiphers.find((d) => d.id === cipher.id) || cipher
  }, [allCiphers, cipher])

  const isCipherShare = useMemo(() => {
    if (send) {
      return false
    }
    return originCipher.organizationId && (
      common.isCipherShared(originCipher.organizationId)
        || common.isCipherSharedWithMe(originCipher.organizationId)
    )
  }, [originCipher])

  const cipherType = useMemo(() => {
    return common.cipherTypeInfo('listRouter', currentPage.name, cipher.type)
  }, [originCipher, currentPage])

  return (
    <div className="flex items-center">
      <CipherIcon
        item={originCipher}
        isDeleted={originCipher?.isDeleted}
        type={originCipher.type}
      />
      <div className="ml-2 flex-1">
        <div className="flex items-center">
          <RouterLink
            className={'font-semibold'}
            label={cipher.name || originCipher.name || t('shares.encrypted_content')}
            routerName={cipherType?.detailRouter || global.keys.VAULT_DETAIL}
            routerParams={{ cipher_id: cipher.id || originCipher.id }}
            icon={
              isCipherShare ? <ImageIcon
                className="ml-1"
                name={'shares-icon'}
                title={t('inventory.shared')}
              /> : <></>
            }
          />
          {
            send && common.isExpired(send) && <Tag
              className="ml-2"
              color="error"
            >
              {t('statuses.expired')}
            </Tag>
          }
        </div>
        <TextCopy
          className="text-sm"
          value={common.cipherSubtitle(originCipher)}
        />
      </div>
    </div>
  );
}

export default Name;