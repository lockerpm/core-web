import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Typography,
} from '@lockerpm/design';

import {
  CopyOutlined,
  CheckOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';

import common from "../../utils/common";

const TextCopy = (props) => {
  const {
    className = '',
    value = '',
    align = 'start',
    color = '',
    limited = true,
    showIcon = false,
    display = null,
    show = null,
    defaultShow = null
  } = props;

  const locale = useSelector((state) => state.system.locale);

  const { t } = useTranslation()
  const [isHover, setIsHover] = useState(false)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    setShowText(show)
  }, [show])

  useEffect(() => {
    setShowText(defaultShow === null ? show : defaultShow)
  }, [])

  const icons = useMemo(() => {
    if (isHover || showIcon) {
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
    if (show != null) {
      return <div
        style={{ color: color }}
        className={`flex items-center justify-${align} w-full ${color ? '' : 'text-black-500'}`}
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
      className={`${limited ? 'text-limited' : ''} ${color ? '' : 'text-black-500'}`}
      style={{ color: color }}
      title={value}
    >
      {value}
    </div>
  }, [
    value,
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