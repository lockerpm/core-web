import React, { useMemo, useState } from "react";
import {
  Typography,
  Input
} from '@lockerpm/design';

import {
} from '../../utils/common'

import { useTranslation } from "react-i18next";
import { gray } from '@ant-design/colors';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

const TextCopyItem = (props) => {
  const {
    className = '',
    value = '',
    isPassword = false,
    align = 'start',
    color = '',
    limited = true,
  } = props;

  const { t } = useTranslation()
  const [isHover, setIsHover] = useState(false)

  const icons = useMemo(() => {
    if (isHover) {
      return [
        <CopyOutlined/>,
        <CheckOutlined/>
      ]
    }
    return [
      <></>,
      <></>
    ]
  })

  const DisplayValue = useMemo(() => {
    if (value) {
      if (isPassword) {
        return <Input.Password
          className={`p-0 text-${align}`}
          value={value}
          bordered={false}
        />
      }
      return <div
        className={`${limited ? 'text-limited' : ''}`}
        style={{ color: color || gray[6] }}
        title={value}
      >
        {value}
      </div>
    }
    return <></>
  }, [value, isPassword, align])

  return (
    <Typography.Text
      className={`text-copy flex items-center cursor-pointer justify-${align} ${className}`}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      copyable={{
        icon: icons,
        tooltips: [
          t('common.copy'),
          t('common.copied')
        ],
        text: value
      }}
    >
      {DisplayValue}
    </Typography.Text>
  );
}

export default TextCopyItem;