import React, { useMemo } from "react";
import {
  Select,
  Tag
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import global from "../../../../../config/global";
import common from "../../../../../utils/common";
import enterpriseMemberServices from "../../../../../services/enterprise-member";

const Role = (props) => {
  const {
    record = null,
    enterpriseId,
    className = 'w-full',
    onReload = () => { },
  } = props;
  const { t } = useTranslation()
  const userInfo = useSelector((state) => state.auth.userInfo)

  const isUpdate = useMemo(() => {
    if (userInfo.is_super_admin) {
      return record.email !== userInfo?.email
    }
    return record.role !== global.constants.USER_ROLE.PRIMARY_ADMIN && record.email !== userInfo?.email
  }, [record, userInfo])

  const roleOptions = useMemo(() => {
    const roles = global.constants.USER_ROLES
    if (userInfo.is_super_admin || record.role === global.constants.USER_ROLE.PRIMARY_ADMIN) {
      return roles
    }
    return roles.filter((r) => r.value !== global.constants.USER_ROLE.PRIMARY_ADMIN)
  }, [userInfo, record])

  const onUpdate = (role) => {
    enterpriseMemberServices
      .update(enterpriseId, record.id, {
        role: role
      }).then(() => {
        global.pushSuccess(t("notification.success.enterprise_members.updated"))
        onReload()
      }).catch((error) => {
        global.pushError(error)
      })
  }

  return (
    <Select
      className={className}
      value={record.role}
      bordered={false}
      onChange={(v) => onUpdate(v)}
      disabled={!isUpdate}
      options={
        roleOptions.map((r) => ({
          value: r.value,
          label: (() => {
            const role = common.getUserRole(r.value)
            return <div className="h-full">
              <Tag color={role.color}>
                {t(role?.label)}
              </Tag>
            </div>
          })()
        })
        )
      }
    />
  );
}

export default Role;
