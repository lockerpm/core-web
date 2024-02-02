import React, { } from "react";
import { useTranslation } from "react-i18next";

import {
  Pagination,
  ConfigProvider
} from '@lockerpm/design';

const PaginationItem = (props) => {
  const {
    params = {},
    total = 0,
    onChange = () => {}
  } = props;

  const { t } = useTranslation()

  return (
    <ConfigProvider theme={{ token: { wireframe: true } }}>
      <Pagination
        className="pagination"
        current={params.page}
        pageSize={params.size}
        total={total}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `${t('common.total')} ${total} ${t('common.items')}`}
        onChange={onChange}
      />
    </ConfigProvider>
  );
}

export default PaginationItem;