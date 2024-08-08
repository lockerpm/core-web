import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import commonComponents from "../../../components/common";
import policiesComponents from "./components";

import common from "../../../utils/common";

const PoliciesViolated = (props) => {
  const { PageHeader } = commonComponents;
  const { ViolatedItems } = policiesComponents;
  const { } = props;
  const { t } = useTranslation();

  const syncPolicies = useSelector((state) => state.sync.syncPolicies);
  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const passwordRequirements = useMemo(() => {
    return syncPolicies.find((p) => p.policyType === 'password_requirement')
  }, [syncPolicies])

  const violatedItems = useMemo(() => {
    return common.violatedPasswordCiphers(allCiphers, passwordRequirements)
  }, [allCiphers, passwordRequirements]);

  return (
    <div className="policies layout-content">
      <PageHeader
        title={t('policies_violated.title')}
        total={violatedItems.length}
        actions={[]}
      />
      <ViolatedItems
        data={violatedItems}
      />
    </div>
  );
}

export default PoliciesViolated;