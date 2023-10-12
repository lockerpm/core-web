import React, { useMemo } from "react";
import {
  Image
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy,
  RouterLink,
  ImageIcon
} from '../../../../../components';

import {
} from "@ant-design/icons";

import CipherIcon from "./CipherIcon";

import common from "../../../../../utils/common";
import global from "../../../../../config/global";

const Name = (props) => {
  const { t } = useTranslation()
  const { cipher = {} } = props;
  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const allOrganizations = useSelector((state) => state.organization.allOrganizations)
  return (
    <div className="flex items-center">
      <CipherIcon
        // item={cipher}
        type={cipher.type}
      />
      <div className="ml-2 flex-1">
        <div className="flex items-center">
          <RouterLink
            className={'font-semibold'}
            label={cipher.name}
            routerName={global.keys.VAULT_DETAIL}
            routerParams={{ id: cipher.id }}
            icon={
              cipher.organizationId && (
                common.isCipherShared(cipher.organizationId) || common.isCipherSharedWithMe(allOrganizations, cipher.organizationId)
              ) ? <ImageIcon
                className="ml-1"
                name={'shares-icon'}
                title={t('inventory.shared')}
              /> : <></>
            }
          />
        </div>
        <TextCopy
          className="text-sm"
          value={common.cipherSubtitle(allCiphers.find((d) => d.id === cipher.id))}
        />
      </div>
    </div>
  );
}

export default Name;