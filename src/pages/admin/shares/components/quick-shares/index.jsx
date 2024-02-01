import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import { } from "@ant-design/icons";
import { } from "../../../../../components";

import TableData from "./TableData";
import ListData from "./ListData";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

const QuickShares = (props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    loading = false,
    params = {},
    isFolder = false,
    filteredData = [],
    onStopSharing = () => {},
  } = props

  const isMobile = useSelector((state) => state.system.isMobile)

  return (
    <div
      className="quick-shares"
    >
      {
        isMobile ? <ListData
          className="mt-4"
          loading={loading}
          data={filteredData.result}
          params={params}
          isFolder={isFolder}
          onStopSharing={onStopSharing}
        /> : <TableData
          className="mt-4"
          loading={loading}
          data={filteredData.result}
          params={params}
          isFolder={isFolder}
          onStopSharing={onStopSharing}
        />
      }
    </div>
  );
}

export default QuickShares;