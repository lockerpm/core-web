import React, { useEffect, useMemo, useState } from "react";
import {
  Progress,
} from '@lockerpm/design';
import {
  SafetyCertificateOutlined,
} from "@ant-design/icons";

import { useTranslation } from "react-i18next";

import { } from 'react-redux';

import commonServices from "../../../services/common";

const passwordStatuses = [
  {
    score: 10,
    label: '',
    color: '',
    percent: 0
  },
  {
    score: 0,
    label: 'very_weak',
    color: '#f54f64',
    percent: 10
  },
  {
    score: 1,
    label: 'weak',
    color: '#f54f64',
    percent: 25
  },
  {
    score: 2,
    label: 'medium',
    color: '#ff9800',
    percent: 50
  },
  {
    score: 3,
    label: 'good',
    color: '#0363c2',
    percent: 75
  },
  {
    score: 4,
    label: 'strong',
    color: '#3db249',
    percent: 100
  },
]

const PasswordStrength = (props) => {
  const { t } = useTranslation();
  const {
    password = '',
    showProgress = true
  } = props
  const passwordStrength = useMemo(() => {
    return commonServices.password_strength(password)
  }, [password])

  const passwordStatus = useMemo(() => {
    return passwordStatuses.find((s) => s.score === passwordStrength?.score) || {}
  }, [passwordStrength])
  return (
    <div className="w-full flex items-center">
      {
        showProgress && <Progress
          className="mb-0"
          percent={passwordStatus.percent}
          showInfo={false}
          strokeColor={passwordStatus.color}
        />
      }
      <div
        className={`flex items-center justify-${showProgress ? 'end' : ''}`}
        style={{
          color: passwordStatus.color,
          width: 100
        }}
      >
        <SafetyCertificateOutlined />
        <small className="ml-1">
          {t(`generate_password.status.${passwordStatus.label}`)}
        </small>
      </div>
    </div>
    
  )
}

export default PasswordStrength;