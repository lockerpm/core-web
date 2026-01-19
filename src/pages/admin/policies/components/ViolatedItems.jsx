import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import {
  List,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import cipherComponents from "../../../../components/cipher";
import modalsComponents from "../../../../components/modals";

const ViolatedItems = (props) => {
  const { Name } = cipherComponents;
  const { PasswordViolatedModal } = modalsComponents;
  const { t } = useTranslation();
  const {
    className = '',
    data = [],
  } = props;

  const [selectedItem, setSelectedItem] = useState({});
  const [violatedVisible, setViolatedVisible] = useState(false);
  
  return (
    <>
      <List
        bordered={false}
        dataSource={data}
        className={className}
        renderItem={(record) => (
          <List.Item>
            <div
              className="flex items-center justify-between w-full"
              key={record.id}
            >
              <div className="flex-1">
                <Name cipher={record}/>
              </div>
              <div className="flex items-center ml-2">
                <div
                  className="cursor-pointer"
                  style={{
                    borderRadius: 100,
                    overflow: 'hidden'
                  }}
                  onClick={() => {
                    setSelectedItem(record)
                    setViolatedVisible(true)
                  }}
                >
                  <div className="bg-danger flex">
                    <p className="font-semibold text-white px-3 py-1">
                      {t('policies_violated.violations', { count: record.violations.length }) }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
      <PasswordViolatedModal
        visible={violatedVisible}
        item={selectedItem}
        onClose={() => setViolatedVisible(false)}
      />
    </>
  );
}

export default ViolatedItems;
