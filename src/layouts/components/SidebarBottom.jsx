import React, { } from 'react';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from '@ant-design/icons'

import {
} from '@ant-design/colors';

function SidebarBottom(props) {
  const { t } = useTranslation();
  const { collapsed } = props;

  return (
    <div className="admin-layout-sidebar-bottom">
    </div>
  );
}

export default SidebarBottom;
