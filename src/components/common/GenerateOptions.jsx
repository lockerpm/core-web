import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
  Slider,
  Checkbox
} from '@lockerpm/design';
import {
  ReloadOutlined,
  DownOutlined,
  RightOutlined
} from "@ant-design/icons";

import itemsComponents from "../items";

import global from "../../config/global";
import common from "../../utils/common";

const GenerateOptions = (props) => {
  const { PasswordStrength } = itemsComponents;
  const { t } = useTranslation();
  const {
    className = '',
    width = '100%',
    isFill = true,
    isShowOptions = false,
    onFill = () => {},
  } = props;

  const syncPolicies = useSelector((state) => state.sync.syncPolicies);

  const [showOptions, setShowOptions] = useState(isShowOptions)
  const [generatedPassword, setGeneratedPassword] = useState(null)
  const [generateOptions, setGenerateOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    number: true,
    special: true,
    ambiguous: false
  })

  const policyConfig = useMemo(() => {
    return syncPolicies.find((p) => p.policyType === 'password_requirement' && p.enabled)?.config
  }, [syncPolicies])

  useEffect(() => {
    if (policyConfig) {
      setGenerateOptions({
        length: policyConfig?.minLength,
        uppercase: policyConfig?.requireUpperCase,
        lowercase: policyConfig?.requireLowerCase,
        number: policyConfig?.requireDigit,
        special: policyConfig?.requireSpecialCharacter,
        ambiguous: generateOptions.ambiguous
      })
    }
  }, [policyConfig])

  useEffect(() => {
    setShowOptions(isShowOptions);
  }, [isShowOptions])

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
    <div className={className} style={{ width: width }}>
      <div className="flex items-center justify-between mb-2">
        <p
          className="text-limited text-md w-4/5"
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
      <div className="mt-4">
        {
          isFill && <Button
            ghost
            type="primary"
            className="w-full mb-2"
            onClick={() => onFill(generatedPassword)}
          >
            {t('generate_password.fill_password')}
          </Button>
        }
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
            {
              showOptions ? <DownOutlined style={{ fontSize: 12 }}/> : <RightOutlined style={{ fontSize: 12 }}/>
            }
          </div>
        </Button>
      </div>
      {
        showOptions && <div>
          <p>{t('common.length')}</p>
          <Slider
            className="mx-0 my-1"
            min={policyConfig?.minLength || 0}
            value={generateOptions.length}
            
            onChange={(v) => setGenerateOptions({ ...generateOptions, length: v })}
          />
          <Checkbox
            className="w-full"
            disabled={policyConfig?.requireUpperCase || false}
            checked={generateOptions.uppercase}
            onChange={(e) => setGenerateOptions({ ...generateOptions, uppercase: e.target.checked })}
          >
            {t('generate_password.options.uppercase')}
          </Checkbox>
          <Checkbox
            className="w-full"
            disabled={policyConfig?.requireLowerCase || false}
            checked={generateOptions.lowercase}
            onChange={(e) => setGenerateOptions({ ...generateOptions, lowercase: e.target.checked })}
          >
            {t('generate_password.options.lowercase')}
          </Checkbox>
          <Checkbox
            className="w-full"
            disabled={policyConfig?.requireDigit || false}
            checked={generateOptions.number}
            onChange={(e) => setGenerateOptions({ ...generateOptions, number: e.target.checked })}
          >
            {t('generate_password.options.digits')}
          </Checkbox>
          <Checkbox
            className="w-full"
            disabled={policyConfig?.requireSpecialCharacter || false}
            checked={generateOptions.special}
            onChange={(e) => setGenerateOptions({ ...generateOptions, special: e.target.checked })}
          >
            {t('generate_password.options.symbols')}
          </Checkbox>
          <Checkbox
            className="w-full"
            checked={generateOptions.ambiguous}
            onChange={(e) => setGenerateOptions({ ...generateOptions, ambiguous: e.target.checked })}
          >
            {t('generate_password.options.ambiguous')}
          </Checkbox>
        </div>
      }
      {
        policyConfig && <p className="text-danger mt-2">
          (*) {t('policies.generator')}
        </p>
      }
    </div>
  );
}

export default GenerateOptions;