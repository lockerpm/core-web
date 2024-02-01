import React, { useMemo } from "react";
import {
} from '@lockerpm/design';

import { useTranslation } from "react-i18next";

import components from "../../../../components";

import {
} from "@ant-design/icons";

import CipherIcon from "../../../admin/vault/components/CipherIcon";

const Name = (props) => {
  const { TextCopy, ImageIcon } = components;
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