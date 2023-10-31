import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Badge
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../../components';

import TableData from "./emergency-access/TableData";

import EmergencyContactFormData from "./form-data/EmergencyContact";


import {
  PlusOutlined,
  RightOutlined,
  DownOutlined
} from "@ant-design/icons";

import { orange } from '@ant-design/colors';

import emergencyAccessServices from "../../../../../services/emergency-access";
import global from "../../../../../config/global";

const EmergencyAccess = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const [listTrusted, setListTrusted] = useState([]);
  const [listGranted, setListGranted] = useState([]);

  useEffect(() => {
    fetchData()
  }, [])

  const trustedPendingRequests = useMemo(() => {
    const listPending = listTrusted.filter(
      item => item.status === global.constants.STATUS.INVITED
    )
    return listPending.length
  }, [listTrusted])

  const grantedPendingRequests = useMemo(() => {
    const listPending = listGranted.filter(
      item => item.status === global.constants.STATUS.INVITED
    )
    return listPending.length
  }, [listGranted])

  const pendingRequests  = useMemo(() => {
    return trustedPendingRequests + grantedPendingRequests
  }, [trustedPendingRequests, grantedPendingRequests])

  const fetchData = async () => {
    Promise.all([
      emergencyAccessServices.list_trusted(),
      emergencyAccessServices.list_granted()
    ]).then(([trusted, granted]) => {
      setListTrusted(trusted);
      setListGranted(granted)
    }).catch(() => {
      setListTrusted([]);
      setListGranted([])
    })
  }

  return (
    <div className={className}>
      <div className="flex justify-between">
        <div
          className="flex text-primary cursor-pointer"
          onClick={() => setExpand(!expand)}
        >
          <p className="font-semibold text-xl mr-1">
            {t('security.emergency_access.title')}
          </p>
          <Badge
            className="flex items-center mr-2"
            count={pendingRequests}
          />
          {
            expand ? <DownOutlined /> : <RightOutlined />
          }
        </div>
        <Button
          type='primary'
          ghost
          icon={<PlusOutlined />}
          onClick={() => setFormVisible(true)}
        >
          {t('security.emergency_access.add')}
        </Button>
      </div>
      <p className="mt-1">
        {t('security.emergency_access.description')}
      </p>
      {
        expand && <div className="mt-4">
          <Card
            size="small"
            title={<div className="flex items-center justify-between">
              <p className="font-semibold" style={{ fontSize: 16 }}>
                {t('security.emergency_access.your_trusted_contacts')}
              </p>
              <small style={{ color: orange[5], fontSize: 12, fontWeight: 400 }}>
                {t('security.emergency_access.pending_requests', { number: trustedPendingRequests })}
              </small>
            </div>}
          >
            <TableData data={listTrusted} isTrusted={true}/>
          </Card>
          <Card
            size="small"
            className="mt-4"
            title={<div className="flex items-center justify-between">
              <p className="font-semibold" style={{ fontSize: 16 }}>
                {t('security.emergency_access.contacts_that_trusted_you')}
              </p>
              <small style={{ color: orange[5], fontSize: 12, fontWeight: 400 }}>
                {t('security.emergency_access.pending_requests', { number: grantedPendingRequests })}
              </small>
            </div>}
          >
            <TableData data={listGranted}/>
          </Card>
        </div>
      }
      <EmergencyContactFormData
        visible={formVisible}
        onClose={() => setFormVisible(false)}
      />
    </div>
  );
}

export default EmergencyAccess;
