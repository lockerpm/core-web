import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { } from 'react-router-dom';

import { } from '@lockerpm/design';
import { } from "@ant-design/icons";

import foldersComponents from "../../../folders/components";
import sharedCiphersComponents from "./shared-ciphers";

const ShareFolders = (props) => {
  const { FormData } = foldersComponents;
  const { ListData, TableData } = sharedCiphersComponents;
  const { t } = useTranslation();

  const {
    loading = false,
    params = {},
    filteredData = [],
    onLeave = () => {},
    onUpdateStatus = () => {}
  } = props

  const isMobile = useSelector((state) => state.system.isMobile)

  const [formVisible, setFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenForm = (item = null, cloneMode = false) => {
    setSelectedItem(item);
    setFormVisible(true);
  }

  return (
    <div
      className="share-ciphers"
    >
      {
        isMobile ? <ListData
          className="mt-4"
          loading={loading}
          data={filteredData.result}
          params={params}
          isFolder={true}
          onUpdate={handleOpenForm}
          onLeave={onLeave}
          onUpdateStatus={onUpdateStatus}
        /> : <TableData
          className="mt-4"
          loading={loading}
          data={filteredData.result}
          params={params}
          isFolder={true}
          onUpdate={handleOpenForm}
          onLeave={onLeave}
          onUpdateStatus={onUpdateStatus}
        />
      }
      <FormData
        visible={formVisible}
        item={selectedItem}
        onClose={() => {
          setFormVisible(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

export default ShareFolders;