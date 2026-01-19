import React from "react";
import { useTranslation } from "react-i18next";

import {
  Tabs
} from '@lockerpm/design';

const MenuTabs = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    activeTab = null,
    onChange = () => { }
  } = props;
  return (
    <div className={className}>
      <Tabs
        activeKey={activeTab}
        items={[
          {
            key: 'active',
            label: t('enterprise_members.tabs.active'),
          },
          {
            key: 'pending',
            label: t('enterprise_members.tabs.pending'),
          },
          {
            key: 'disabled',
            label: t('enterprise_members.tabs.disabled'),
          },
          {
            key: 'blocked',
            label: t('enterprise_members.tabs.blocked'),
          },
        ].map((m) => {
          return {
            label: (
              <span className="font-semibold">
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