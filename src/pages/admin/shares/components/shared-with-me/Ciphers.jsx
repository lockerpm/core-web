import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import { } from '@lockerpm/design';

import { } from "@ant-design/icons";

import vaultComponents from "../../../vault/components";
import sharedCiphersComponents from "./shared-ciphers";

import common from "../../../../../utils/common";

const ShareCiphers = (props) => {
  const { FormData, MoveFolder } = vaultComponents;
  const { ListData, TableData } = sharedCiphersComponents;
  const { t } = useTranslation();
  const location = useLocation();

  const {
    loading = false,
    params = {},
    filteredData = [],
    onLeave = () => {},
    onUpdateStatus = () => {}
  } = props

  const currentPage = common.getRouterByLocation(location);

  const isMobile = useSelector((state) => state.system.isMobile)

  const [cloneMode, setCloneMode] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [moveVisible, setMoveVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenForm = (item = null, cloneMode = false) => {
    setSelectedItem(item);
    setFormVisible(true);
    setCloneMode(cloneMode)
  }

  const handleOpenMoveForm = (item = null) => {
    setSelectedItem(item);
    setMoveVisible(true);
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
          onMove={handleOpenMoveForm}
          onUpdate={handleOpenForm}
          onLeave={onLeave}
          onUpdateStatus={onUpdateStatus}
        /> : <TableData
          className="mt-4"
          loading={loading}
          data={filteredData.result}
          params={params}
          onMove={handleOpenMoveForm}
          onUpdate={handleOpenForm}
          onLeave={onLeave}
          onUpdateStatus={onUpdateStatus}
        />
      }
      <FormData
        visible={formVisible}
        item={selectedItem}
        cloneMode={cloneMode}
        cipherType={common.cipherTypeInfo('type', selectedItem?.type)}
        folderId={currentPage.params.folder_id}
        setCloneMode={setCloneMode}
        onClose={() => {
          setFormVisible(false);
          setSelectedItem(null);
        }}
      />
      <MoveFolder
        visible={moveVisible}
        cipherIds={[selectedItem]}
        onClose={() => {
          setMoveVisible(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

export default ShareCiphers;