import React, { useMemo } from "react";
import {
} from '@lockerpm/design';

import { useTranslation } from "react-i18next";

import { TextCopy, ImageIcon } from "../../../../components";

import {
} from "@ant-design/icons";

import CipherIcon from "../../../admin/vault/components/table/CipherIcon";

const Name = (props) => {
  const { t } = useTranslation()

  const { cipher = {}, showText } = props;

  return (
    <div className="text-center">
      {
        showText ? <CipherIcon
          item={cipher}
          isDeleted={cipher?.isDeleted}
          type={cipher.type}
          size={48}
        /> : <ImageIcon
          name={'any-icon'}
          width={48}
          height={48}
        />
      }
      <TextCopy
        className="text-xl font-semibold mt-4"
        align="center"
        show={showText}
        value={cipher.name || t('shares.encrypted_content')}
      />
    </div>
  );
}

export default Name;