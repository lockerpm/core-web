import React, {} from "react";
import { useTranslation } from "react-i18next";

import {
  Card
} from '@lockerpm/design'

import {
  FileSearchOutlined
} from "@ant-design/icons";

const NoPolicies = (props) => {
  const { } = props;
  const { t } = useTranslation();

  return (
    <div className="mt-4">
      <Card className="text-center" bordered={false}>
        <FileSearchOutlined className="text-[40px] text-black-500"/>
        <p className="mt-3">{t('policies.no_policies')}</p>
      </Card>
    </div>
  );
}

export default NoPolicies;