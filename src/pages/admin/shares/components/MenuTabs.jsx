import React, { } from "react";
import {
  Tabs
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../components';

const MenuTabs = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    menus = [],
    menu = null,
    onChange = () => {}
  } = props;
  return (
    <div className={className}>
      <Tabs
        activeKey={menu}
        items={menus.map((m) => {
          return {
            label: (
              <span className="font-semibold">
                {m.icon}
                {m.label}
              </span>
            ),
            key: m.key,
            children: <></>,
          };
        })}
        onChange={onChange}
      />
    </div>
  );
}

export default MenuTabs;