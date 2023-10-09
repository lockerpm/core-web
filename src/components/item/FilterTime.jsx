import React, { useState, useMemo, useEffect } from "react";
import {
  Dropdown,
  Button,
  DatePicker
} from '@lockerpm/design';

import {
  DownOutlined
} from "@ant-design/icons";

import { useSelector } from 'react-redux';
import { getTimeByOption } from '../../utils/common';
import { useTranslation } from "react-i18next";

import dayjs from 'dayjs'

const FilterTime = (props) => {
  const {
    disabled = false,
    params = {},
    onChange = () => { },
  } = props;

  const { t } = useTranslation()

  const items = [
    {
      key: 'all_time',
      label: <span>
        {t('common.all_time')}
      </span>,
      form: <></>
    },
    {
      key: 'last_week',
      label: <span>
        {t('common.last_week')}
      </span>,
      form: <></>
    },
    {
      key: 'last_month',
      label: <span>
        {t('common.last_month')}
      </span>,
      form: <></>
    },
    {
      key: 'custom_time',
      label: <span>
        {t('common.custom_time')}
      </span>,
      form: <DatePicker.RangePicker
        value={params.dates.map((d) => dayjs(d))}
        onChange={(v) => changeCustomTime(v)}
        size="medium"
        allowClear={false}
        className="mr-m filter-filed__m"
        placement="bottomRight"
      />,
    },
  ]

  useEffect(() => {
    setSelectedItem(params.time_option)
  }, [params.time_option])

  const [selectedItem, setSelectedItem] = useState(params.time_option || items[0].key);

  const itemInfo = useMemo(() => {
    return items.find((i) => i.key === selectedItem)
  }, [selectedItem])

  const changeOption = (key) => {
    if (key !== params.time_option) {
      setSelectedItem(key)
      onChange({ time_option: key, dates: getTimeByOption(key, []) })
    }
  }

  const changeCustomTime = (value = []) => {
    onChange({ dates: value })
  }

  return (
    <div>
      {itemInfo.form}
      <Dropdown
        menu={{ items, onClick: ({ key }) => changeOption(key) }}
        placement="bottomRight"
        size="medium"
        trigger={['click']}
        disabled={disabled}
      >
        <Button
          size="medium"
          disabled={disabled}
        >
          {itemInfo.label}
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
}

export default FilterTime;