import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from "react-i18next";

import { Divider } from '@lockerpm/design';

import commonComponents from "../../../components/common";
import policiesComponents from "./components";

const Policies = (props) => {
  const { PageHeader } = commonComponents;
  const {
    PasswordRequirements,
    BlockFailedLogins,
    PasswordlessLogin,
    LoginWith2FA,
    NoPolicies
  } = policiesComponents;
  const { } = props;
  const { t } = useTranslation();

  const teams = useSelector((state) => state.enterprise.teams);
  const syncPolicies = useSelector((state) => state.sync.syncPolicies);

  const isEnterpriseAdmin = useMemo(() => {
    return teams[0]?.role?.includes('admin')
  }, [teams])

  const passwordRequirements = useMemo(() => {
    return syncPolicies.find((p) => p.policyType === 'password_requirement')
  }, [syncPolicies])

  const blockFailedLogin = useMemo(() => {
    return syncPolicies.find((p) => p.policyType === 'block_failed_login')
  }, [syncPolicies])

  const passwordless = useMemo(() => {
    return syncPolicies.find((p) => p.policyType === 'passwordless')
  }, [syncPolicies])

  const loginWith2FA = useMemo(() => {
    return syncPolicies.find((p) => p.policyType === '2fa' )
  }, [syncPolicies])

  const noPolicies = useMemo(() => {
    return !syncPolicies.find((p) => p.enabled && (!p.config.onlyAdmin || isEnterpriseAdmin))
  }, [syncPolicies, isEnterpriseAdmin])
  
  return (
    <div className="policies layout-content">
      <PageHeader
        title={t('policies.title')}
        subtitle={<Trans
          i18nKey={'policies.description'}
          values={{ enterprise_name: teams[0]?.name }}
          components={{
            span: <span className="text-primary" />
          }}
        />}
        actions={[]}
      />
      {
        noPolicies && <NoPolicies />
      }
      {
        passwordRequirements?.enabled && <>
          <PasswordRequirements policy={passwordRequirements}/>
          <Divider />
        </>
      }
      {
        blockFailedLogin?.enabled && <>
          <BlockFailedLogins policy={blockFailedLogin}/>
          <Divider />
        </>
      }
      {
        passwordless?.enabled && <>
          <PasswordlessLogin policy={passwordless}/>
          <Divider />
        </>
      }
      {
        loginWith2FA?.enabled && (!loginWith2FA.config.onlyAdmin || isEnterpriseAdmin) && <>
          <LoginWith2FA policy={loginWith2FA}/>
          <Divider />
        </>
      }
    </div>
  );
}

export default Policies;