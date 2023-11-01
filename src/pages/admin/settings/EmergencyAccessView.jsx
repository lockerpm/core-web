import React, { useEffect, useState, useMemo } from "react";
import { Spin, Table } from '@lockerpm/design';
import { } from "@ant-design/icons";

import { AdminHeader } from "../../../components";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import common from "../../../utils/common";
import emergencyAccessServices from "../../../services/emergency-access";

const EmergencyAccessView = (props) => {
  const { } = props;
  const { t } = useTranslation();

  const currentPage = common.getRouterByLocation(location);

  const [loading, setLoading] = useState(false);
  const [ciphers, setCiphers] = useState([]);
  
  useEffect(() => {
    if (currentPage.params?.contact_id) {
      fetchData();
    }
  }, [currentPage.params?.contact_id])

  const fetchData = async () => {
    setLoading(true)
    const contactId = currentPage.params?.contact_id
    const viewData = await emergencyAccessServices.view(contactId);
    console.log(viewData);
  }

  return (
    <div className=" layout-content">
      <AdminHeader
        title={t('emergency_access_view.title')}
        total={100}
        description={t('emergency_access_view.description', { owner: 'Khai tran Quang' })}
        actions={[]}
      />
      <Table
        columns={[]}
        dataSource={[]}
        loading={loading}
        pagination={false}
        rowKey={(record) => record?.id}
        size="small"
        scroll={{ x: 1024 }}
      />
    </div>
  );
}

export default EmergencyAccessView;