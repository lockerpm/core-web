import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  ArrowRightOutlined,
} from '@ant-design/icons';

import common from '../../utils/common';
import global from '../../config/global';

function DocLink(props) {
  const { className, docKey, title, showIcon = true } = props
  const locale = useSelector((state) => state.system.locale);
  const linkUrl = useMemo(() => {
    const localeLinks = global.urls.DOC_LINKS[locale] || global.urls.DOC_LINKS.en
    return localeLinks[docKey] || global.urls[docKey]
  }, [locale, docKey])
  return <span
    className={`flex items-center text-primary cursor-pointer ${className}`}
    onClick={() => common.openNewTab(linkUrl)}
  >
    <span>
      {title}
      {
        showIcon && <ArrowRightOutlined className='ml-2'/>
      }
    </span>
  </span>
}

export default DocLink;
