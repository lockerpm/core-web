import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import vaultComponents from "../../../vault/components";
import sharedCiphersComponents from "./shared-ciphers";

import common from "../../../../../utils/common";

const ShareCiphers = (props) => {
  const { FormData, MoveFolder, FormAttachment, DetailData } = vaultComponents;
  const { ListData, TableData } = sharedCiphersComponents;
  const location = useLocation();

  const {
    loading = false,
    params = {},
    filteredData = {},
    onLeave = () => {},
    onUpdateStatus = () => {}
  } = props

  const currentPage = common.getRouterByLocation(location);

  const isMobile = useSelector((state) => state.system.isMobile)

  const [cloneMode, setCloneMode] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [moveVisible, setMoveVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formAttachmentVisible, setFormAttachmentVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);

  const handleOpenForm = (item = null, cloneMode = false) => {
    setSelectedItem(item);
    setFormVisible(true);
    setCloneMode(cloneMode)
  }

  const handleOpenMoveForm = (item = null) => {
    setSelectedItem(item);
    setMoveVisible(true);
  }

  const handleOpenFormAttachment = (item) => {
    setSelectedItem(item);
    setFormAttachmentVisible(true);
  }

  const handleOpenDetailData = (item) => {
    setSelectedItem(item);
    setDetailVisible(true);
  }

  return (
    <div
      className="share-ciphers"
    >
      {
        isMobile ? <ListData
          className="mt-2"
          loading={loading}
          data={filteredData.result}
          params={params}
          onMove={handleOpenMoveForm}
          onUpdate={handleOpenForm}
          onLeave={onLeave}
          onUpdateStatus={onUpdateStatus}
          onAttachment={handleOpenFormAttachment}
          onDetail={handleOpenDetailData}
        /> : <TableData
          className="mt-4"
          loading={loading}
          data={filteredData.result}
          params={params}
          onMove={handleOpenMoveForm}
          onUpdate={handleOpenForm}
          onLeave={onLeave}
          onUpdateStatus={onUpdateStatus}
          onAttachment={handleOpenFormAttachment}
          onDetail={handleOpenDetailData}
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
      <FormAttachment
        visible={formAttachmentVisible}
        item={selectedItem}
        onClose={() => {
          setFormAttachmentVisible(false);
          setSelectedItem(null);
        }}
      />
      <DetailData
        visible={detailVisible}
        item={selectedItem}
        onClose={() => {
          setDetailVisible(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

export default ShareCiphers;