import React, { useEffect, useState, useMemo } from "react"
import { useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import {
  Row,
  Col
} from "@lockerpm/design"

import {
} from "@ant-design/icons"

import commonComponents from "../../../components/common";
import policiesComponents from "./components/policies";

import enterprisePolicyServices from "../../../services/enterprise-policy"

import common from "../../../utils/common";

const EnterprisePolicies = (props) => {
  const { PageHeader } = commonComponents;
  const {
    PasswordRequirements,
    PasswordlessLogin,
    BlockFailedLogins,
    LoginWith2FA
  } = policiesComponents;

  const { } = props
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()

  const currentPage = common.getRouterByLocation(location)
  const enterpriseId = currentPage?.params.enterprise_id

  const [loading, setLoading] = useState(false)
  const [policies, setPolicies] = useState([])

  useEffect(() => {
    getPolicies()
  }, [])

  const getPolicies = async () => {
    setLoading(true);
    await enterprisePolicyServices.list(enterpriseId).then((response) => {
      setPolicies(response);
    }).catch(() => {
      setPolicies([]);
    });
    setLoading(false);
  }

  const handleOnUpdated = (policy) => {
    setPolicies(policies.map((p) => p.policy_type === policy.policy_type ? policy : p))
    common.syncPolicies();
  }

  return (
    <div className='enterprise_members layout-content'>
      <PageHeader
        title={t("enterprise_policies.title")}
        actions={[]}
      />
      <Row gutter={[24, 24]} className="mt-2">
        <Col lg={12} md={12} sm={24} xs={24}>
          <PasswordRequirements
            loading={loading}
            enterpriseId={enterpriseId}
            policy={policies.find((p) => p.policy_type === 'password_requirement')}
            onUpdated={handleOnUpdated}
          />
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <PasswordlessLogin
            loading={loading}
            enterpriseId={enterpriseId}
            policy={policies.find((p) => p.policy_type === 'passwordless')}
            onUpdated={handleOnUpdated}
          />
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <BlockFailedLogins
            loading={loading}
            enterpriseId={enterpriseId}
            policy={policies.find((p) => p.policy_type === 'block_failed_login')}
            onUpdated={handleOnUpdated}
          />
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <LoginWith2FA
            loading={loading}
            enterpriseId={enterpriseId}
            policy={policies.find((p) => p.policy_type === '2fa')}
            onUpdated={handleOnUpdated}
          />
        </Col>
      </Row>
    </div>
  )
}

export default EnterprisePolicies
