import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  Avatar,
  Tooltip
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import common from "../../utils/common";

const SharedWith = (props) => {
  const { t } = useTranslation()
  
  const {
    className = '',
    send = null,
  } = props;

  const locale = useSelector((state) => state.system.locale);

  const sharedWithText = useMemo(() => {
    if (!send?.requireOtp) {
      return <span>{t('shares.quick_shares.anyone')}</span>
    }
    if (!send?.emails?.length) {
      return <span>{t('shares.quick_shares.nobody')}</span>
    }
    return <Avatar.Group maxCount={3}>
      {
        send?.emails.map((e, index) => <Tooltip key={index} title={e.email}>
          <Avatar
            style={{
              backgroundColor: common.getColorByIndex(index),
              color: 'black'
            }}
          >
            {e.email.slice(0, 1)?.toUpperCase()}
          </Avatar>
        </Tooltip>)
      }
    </Avatar.Group>
  }, [send, locale])

  return (
    <div className={className}>
      {sharedWithText}
    </div>
  );
}

export default SharedWith;
