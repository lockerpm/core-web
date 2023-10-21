import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import { } from "@ant-design/icons";
import { } from "../../../../../components";

import TableData from "./TableData";
import BoxData from "./BoxData";

import FormData from "./FormData";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import common from "../../../../../utils/common";

const InAppShares = (props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    loading = false,
    params = {},
    isFolder = false,
    filteredData = [],
    onStopSharing = () => {},
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
      className="in-app-shares"
    >
      {
        isMobile ? <BoxData
          className="mt-4"
          loading={loading}
          data={filteredData.result}
          params={params}
          isFolder={isFolder}
          onUpdate={handleOpenForm}
          onStopSharing={onStopSharing}
          onUpdateStatus={onUpdateStatus}
        /> : <TableData
          className="mt-4"
          loading={loading}
          data={filteredData.result}
          params={params}
          isFolder={isFolder}
          onUpdate={handleOpenForm}
          onStopSharing={onStopSharing}
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

export default InAppShares;