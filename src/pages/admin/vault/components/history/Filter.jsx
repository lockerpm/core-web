import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
  Dropdown,
} from '@lockerpm/design';

import {
  CaretDownOutlined,
} from "@ant-design/icons";

import itemsComponents from "../../../../../components/items";

import global from "../../../../../config/global";

const Filter = (props) => {
  const { t } = useTranslation();
  const { ImageIcon } = itemsComponents;
  const {
    className = '',
    params = {},
    loading = false,
    setParams = () => { }
  } = props;

  const locale = useSelector((state) => state.system.locale);
  const isMobile = useSelector((state) => state.system.isMobile);

  const sortOptions = global.constants.SORT_OPTIONS.filter((o) => o.orderField !== 'name')

  const selectedSortOption = useMemo(() => {
    return sortOptions.find((o) =>
      o.orderDirection === params.orderDirection
    )
  }, [params])

  const sortMenus = useMemo(() => {
    return sortOptions.map((o) => ({
      key: o.key,
      label: <p className={o.key === selectedSortOption?.key ? 'text-primary' : ''}>
        {t(o.label)}
      </p>,
      onClick: () => setParams({
        ...params,
        orderDirection: o.orderDirection
      })
    }))
  }, [selectedSortOption, params, locale])

  return (
    <div
      className={`filter ${className} flex items-center justify-between`}
    >
      <div></div>
      <div>
        {
          isMobile ? <Dropdown
            trigger={['click']}
            disabled={loading}
            menu={{
              items: sortMenus,
              selectedKeys: []
            }}
          >
            <Button
              icon={<ImageIcon
                name={'sort'}
                width={18}
                height={18}
              />}
            />
          </Dropdown> : <Dropdown.Button
            icon={<CaretDownOutlined />}
            trigger={['click']}
            disabled={loading}
            menu={{
              items: sortMenus,
              selectedKeys: []
            }}
          >
            {t('sort_options.sort_by')}
          </Dropdown.Button>
        }
      </div>
    </div>
  );
}

export default Filter;
