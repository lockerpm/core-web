import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import { } from "@ant-design/icons";
import { } from "../../../../../components";

import TableData from "./TableData";
import BoxData from "./BoxData";

import FormData from "../../../folders/components/FormData";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

const ShareFolders = (props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    loading = false,
    params = {},
    filteredData = []
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
        isMobile ? <BoxData
          className="mt-4"
          loading={loading}
          data={filteredData.result}
          params={params}
          onUpdate={handleOpenForm}
        /> : <TableData
          className="mt-4"
          loading={loading}
          data={filteredData.result}
          params={params}
          onUpdate={handleOpenForm}
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