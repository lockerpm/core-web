import React, { useEffect, useMemo, useState } from "react";
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
import PasswordStrength from "./PasswordStrength";
import { useTranslation } from "react-i18next";

import { } from 'react-redux';

import global from "../../../config/global";
import common from "../../../utils/common";

const GeneratePasswordContent = (props) => {
  const { t } = useTranslation();
  const {
    className = '',
    width = '100%',
    isFill = true,
    isShowOptions = false,
    onFill = () => {},
  } = props;

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
            value={generateOptions.length}
            onChange={(v) => setGenerateOptions({ ...generateOptions, length: v })}
          />
          <Checkbox
            className="w-full"
            checked={generateOptions.uppercase}
            onChange={(e) => setGenerateOptions({ ...generateOptions, uppercase: e.target.checked })}
          >
            {t('generate_password.options.uppercase')}
          </Checkbox>
          <Checkbox
            className="w-full"
            checked={generateOptions.lowercase}
            onChange={(e) => setGenerateOptions({ ...generateOptions, lowercase: e.target.checked })}
          >
            {t('generate_password.options.lowercase')}
          </Checkbox>
          <Checkbox
            className="w-full"
            checked={generateOptions.number}
            onChange={(e) => setGenerateOptions({ ...generateOptions, number: e.target.checked })}
          >
            {t('generate_password.options.digits')}
          </Checkbox>
          <Checkbox
            className="w-full"
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
    </div>
  );
}

export default GeneratePasswordContent;