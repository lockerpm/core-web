import React from "react";

import { useTranslation } from "react-i18next";

import {
} from "@ant-design/icons";

const PolicyResult = (props) => {
  const { t } = useTranslation();
  const {
    className = "",
    issues = 1,
  } = props;

  return (
    <div
      className={className}
      style={{
        borderRadius: 100,
        overflow: 'hidden'
      }}
    >
      {
        issues > 0 && <div className="bg-danger h-full">
          <p className="font-semibold text-white px-3 py-1">
            {t('policies.issues', { number: issues }) }
          </p>
        </div>
      }
      {
        issues <= 0 && <div className="bg-success h-full">
          <p className="font-semibold text-white px-3 py-1">
            {t('policies.good')}
          </p>
        </div>
      }
    </div>
  );
}

export default PolicyResult;