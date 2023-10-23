import React, { useEffect, useMemo, useState } from "react";
import {
  Popover,
  Progress,
  Button,
  Slider,
  Checkbox
} from '@lockerpm/design';
import {
  SafetyCertificateOutlined,
  ReloadOutlined,
  DownOutlined,
} from "@ant-design/icons";

import { useTranslation } from "react-i18next";

import { } from 'react-redux';

import commonServices from "../../services/common";
import global from "../../config/global";
import common from "../../utils/common";

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

const GeneratePassword = (props) => {
  const { t } = useTranslation();
  const {
    className = '',
    password = '',
    onFill = () => {}
  } = props;

  const [showOptions, setShowOptions] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState(null)
  const [generateOptions, setGenerateOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    number: true,
    special: true,
    ambiguous: false
  })

  useEffect(() => {
    regenerate();
  }, [JSON.stringify(generateOptions)])

  const regenerate = async () => {
    let options = generateOptions
    if (
      !options.lowercase &&
      !options.uppercase &&
      !options.lowercase &&
      !options.number &&
      !options.special
    ) {
      options = { ...options, lowercase: true }
      setGenerateOptions(options)
    }
    const result = await global.jsCore.passwordGenerationService.generatePassword(options);
    setGeneratedPassword(result)
  }

  return (
    <div className={`generate-password ${className}`}>
      {
        password && <PasswordStrength password={password}/>
      }
      <div className="text-right">
        <Popover
          placement="bottomRight"
          trigger={['hover']}
          title={<div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-limited text-md w-4/5"
                style={{ display: 'block' }}
                title={generatedPassword}
              >
                {generatedPassword}
              </p>
              <Button
                type="primary"
                ghost
                shape="circle"
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => regenerate()}
              />
            </div>
            <PasswordStrength
              password={generatedPassword}
              showProgress={false}
            />
          </div>}
          content={<div className="px-2">
            <Button
              ghost
              type="primary"
              className="w-full mb-2"
              onClick={() => onFill(generatedPassword)}
            >
              {t('generate_password.fill_password')}
            </Button>
            <Button
              type="primary"
              className="w-full"
              onClick={() => common.copyToClipboard(generatedPassword)}
            >
              {t('generate_password.copy_password')}
            </Button>
            <Button
              type="link"
              className="w-full"
              onClick={() => setShowOptions(!showOptions)}
            >
              <div>
                <small className="mr-1">{t('generate_password.show_options')}</small>
                <DownOutlined style={{ fontSize: 12 }}/>
              </div>
            </Button>
            {
              showOptions && <div className="mb-2">
                <p>{t('common.length')}</p>
                <Slider
                  className="mx-0 my-1"
                  value={generateOptions.length}
                  onChange={(v) => setGenerateOptions({ ...generateOptions, length: v })}
                />
                <Checkbox
                  checked={generateOptions.uppercase}
                  onChange={(e) => setGenerateOptions({ ...generateOptions, uppercase: e.target.checked })}
                >
                  {t('generate_password.options.uppercase')}
                </Checkbox>
                <Checkbox
                  checked={generateOptions.lowercase}
                  onChange={(e) => setGenerateOptions({ ...generateOptions, lowercase: e.target.checked })}
                >
                  {t('generate_password.options.lowercase')}
                </Checkbox>
                <Checkbox
                  checked={generateOptions.number}
                  onChange={(e) => setGenerateOptions({ ...generateOptions, number: e.target.checked })}
                >
                  {t('generate_password.options.digits')}
                </Checkbox>
                <Checkbox
                  checked={generateOptions.special}
                  onChange={(e) => setGenerateOptions({ ...generateOptions, special: e.target.checked })}
                >
                  {t('generate_password.options.symbols')}
                </Checkbox>
                <Checkbox
                  checked={generateOptions.ambiguous}
                  onChange={(e) => setGenerateOptions({ ...generateOptions, ambiguous: e.target.checked })}
                >
                  {t('generate_password.options.ambiguous')}
                </Checkbox>
              </div>
            }
            
          </div>}
        >
          <span className="text-primary font-semibold cursor-pointer">
            {t('generate_password.title')}
          </span>
        </Popover>
      </div>
    </div>
  );
}

export default GeneratePassword;