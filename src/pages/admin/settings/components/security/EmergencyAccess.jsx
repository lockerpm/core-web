import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Badge
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../../components';

import TableData from "./emergency-access/TableData";
import BoxData from "./emergency-access/BoxData";
import ResetPasswordFormData from "./form-data/ResetPassword";
import EmergencyContactFormData from "./form-data/EmergencyContact";


import {
  PlusOutlined,
  RightOutlined,
  DownOutlined
} from "@ant-design/icons";

import { orange } from '@ant-design/colors';
import { useLocation } from "react-router-dom";

import emergencyAccessServices from "../../../../../services/emergency-access";
import global from "../../../../../config/global";
import common from "../../../../../utils/common";

const EmergencyAccess = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const location = useLocation();
  const currentPage = common.getRouterByLocation(location);
  const isMobile = useSelector(state => state.system.isMobile);

  const [expand, setExpand] = useState(currentPage?.query?.emergency_access == 'true');
  const [formVisible, setFormVisible] = useState(false);

  const [listTrusted, setListTrusted] = useState([]);
  const [listGranted, setListGranted] = useState([]);
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
    fetchTrusted()
    fetchGranted()
  }

  const fetchTrusted = async () => {
    await emergencyAccessServices.list_trusted().then(res => {
      setListTrusted(res)
    }).catch(() => {
      setListTrusted([])
    })
  }

  const fetchGranted = async () => {
    await emergencyAccessServices.list_granted().then(res => {
      setListGranted(res)
    }).catch(() => {
      setListGranted([])
    })
  }

  
  const handleResetPassword = (item = null) => {
    setSelectedItem(item);
    setResetPasswordVisible(true);
  }

  return (
    <div className={className}>
      <div className="flex justify-between">
        <div
          className="flex text-primary cursor-pointer"
          onClick={() => setExpand(!expand)}
        >
          <p className="font-semibold text-xl mr-2">
            {t('security.emergency_access.title')}
          </p>
          {
            !!pendingRequests && <Badge
              className="flex items-center mr-2"
              count={pendingRequests}
            />
          }
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
          {isMobile ? '' : t('security.emergency_access.add')}
        </Button>
      </div>
      <p className="mt-1">
        {t('security.emergency_access.description')}
      </p>
      {
        expand && <div className="mt-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold" style={{ fontSize: 16 }}>
                {t('security.emergency_access.your_trusted_contacts')}
              </p>
              {
                trustedPendingRequests > 0 && <small style={{ color: orange[5], fontSize: 12, fontWeight: 400 }}>
                  {t('security.emergency_access.pending_requests', { number: trustedPendingRequests })}
                </small>
              }
            </div>
            {
              !isMobile && <TableData
                data={listTrusted}
                isTrusted={true}
                fetchTrusted={fetchTrusted}
                fetchGranted={fetchGranted}
              />
            }
            {
              isMobile && <BoxData
                data={listTrusted}
                isTrusted={true}
                fetchTrusted={fetchTrusted}
                fetchGranted={fetchGranted}
              />
            }
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold" style={{ fontSize: 16 }}>
                {t('security.emergency_access.contacts_that_trusted_you')}
              </p>
              {
                grantedPendingRequests > 0 && <small style={{ color: orange[5], fontSize: 12, fontWeight: 400 }}>
                  {t('security.emergency_access.pending_requests', { number: grantedPendingRequests })}
                </small>
              }
            </div>
            {
              !isMobile && <TableData
                data={listGranted}
                fetchTrusted={fetchTrusted}
                fetchGranted={fetchGranted}
                onResetPassword={handleResetPassword}
              />
            }
            {
              isMobile && <BoxData
                data={listGranted}
                fetchTrusted={fetchTrusted}
                fetchGranted={fetchGranted}
                onResetPassword={handleResetPassword}
              />
            }
          </div>
        </div>
      }
      <EmergencyContactFormData
        visible={formVisible}
        onReload={fetchData}
        onClose={() => setFormVisible(false)}
      />
      <ResetPasswordFormData
        visible={resetPasswordVisible}
        item={selectedItem}
        onClose={() => {
          setResetPasswordVisible(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

export default EmergencyAccess;
