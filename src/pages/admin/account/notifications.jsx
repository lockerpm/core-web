import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import { } from "@ant-design/icons";
import { AdminHeader } from "../../../components";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

import { getRouterByLocation } from '../../../utils/common';


const Notifications = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentPage = getRouterByLocation(window.location);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  return (
    <div className="notifications layout-content">
      <AdminHeader
        title={t('notifications.title')}
        actions={[]}
      />
    </div>
  );
}

export default Notifications;