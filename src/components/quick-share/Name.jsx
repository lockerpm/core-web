import React from "react";
import { useTranslation } from "react-i18next";

import itemsComponents from "../items";
import commonComponents from "../common";

const Name = (props) => {
  const { TextCopy, ImageIcon } = itemsComponents;
  const { CipherIcon } = commonComponents;
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