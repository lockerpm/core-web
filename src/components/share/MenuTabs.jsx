import React from "react";

import { } from "react-i18next";

import {
  Tabs
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

const MenuTabs = (props) => {
  const {
    className = '',
    menus = [],
    menu = null,
    onChange = () => {}
  } = props;
  return (
    <div className={`menu-tabs ${className}`}>
      <Tabs
        activeKey={menu}
        items={menus.map((m) => {
          return {
            label: (
              <span className="font-semibold">
                <span className="mr-2">{m.icon}</span>
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