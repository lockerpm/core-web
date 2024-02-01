import React, { } from "react";
import { } from '@lockerpm/design';
import { } from "@ant-design/icons";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import EmergencyAccessInvitations from "./EmergencyAccessInvitations";

const Notice = (props) => {
  const { className } = props;
  const { t } = useTranslation();
  return (
    <div className={className}>
      <EmergencyAccessInvitations />
    </div>
  );
}

export default Notice;
