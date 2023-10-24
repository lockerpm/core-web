import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Space,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

function QuickShare(props) {
  const {
  } = props
  const { t } = useTranslation()

  return (
    <Space className='flex items-center justify-end'>
      Members
    </Space>
  );
}

export default QuickShare;
