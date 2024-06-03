import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Typography,
  Input
} from '@lockerpm/design';

import {
  CopyOutlined,
  CheckOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';

import { gray } from '@ant-design/colors';

import common from "../../utils/common";

const TextCopy = (props) => {
  const {
    className = '',
    value = '',
    isPassword = false,
    align = 'start',
    color = '',
    limited = true,
    showIcon = false,
    display = null,
    show = null
  } = props;

  const locale = useSelector((state) => state.system.locale);

  const { t } = useTranslation()
  const [isHover, setIsHover] = useState(false)
  const [showText, setShowText] = useState(show)

  useEffect(() => {
    setShowText(show)
  }, [show])

  const icons = useMemo(() => {
    if ((isHover || showIcon) && !!value) {
      return [
        <CopyOutlined/>,
        <CheckOutlined/>
      ]
    }
    return [
      <></>,
      <></>
    ]
  }, [isHover])

  const DisplayValue = useMemo(() => {
    if (value) {
      if (isPassword && showText) {
        return <Input.Password
          className={`p-0 text-${align} mr-2`}
          value={value}
          bordered={false}
        />
      }
      if (show != null) {
        return <div
          style={{ color: color || gray[6] }}
          className={`flex items-center justify-${isPassword ? 'between' : align} w-full`}
        >
          <p
            className={`${limited ? 'text-limited' : ''}`}
            title={common.formatText(value, showText)}
            style={{ marginBottom: 0 }}
          >
            {common.formatText(value, showText)}
          </p>
          <span
            className="ml-2 cursor-pointer"
            onClick={() => setShowText(!showText)}
          >
            {
              !showText ? <EyeOutlined /> : <EyeInvisibleOutlined />
            }
          </span>
        </div>
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
  }, [
    value,
    isPassword,
    align,
    show,
    showText,
    locale
  ])

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
      {display || DisplayValue}
    </Typography.Text>
  );
}

export default TextCopy;