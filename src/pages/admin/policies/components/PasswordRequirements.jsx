import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import {
  DownOutlined,
  RightOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";

import itemsComponents from "../../../../components/items";

import common from "../../../../utils/common";

const PasswordRequirements = (props) => {
  const { PolicyResult } = itemsComponents;
  const { policy } = props;
  const { t } = useTranslation();

  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const [expand, setExpand] = useState(false);

  const violatedItems = useMemo(() => {
    return common.violatedPasswordCiphers(allCiphers, policy)
  }, [allCiphers, policy]);

  return (
    <div className="mt-4">
      <div className="flex justify-between">
        <div
          className="flex text-primary cursor-pointer"
          onClick={() => setExpand(!expand)}
        >
          <p className="font-semibold text-xl mr-2">
            {t('policies.password_requirements.title')}
          </p>
          {
            expand ? <DownOutlined /> : <RightOutlined />
          }
        </div>
        <PolicyResult
          issues={violatedItems.length}
        />
      </div>
      <p className="mt-1">
        {t('policies.password_requirements.description')}
      </p>
      {
        expand && <div className="mt-4">
          <p className="font-semibold text-[16px] mb-2">{t('policies.policy_details')}</p>
          <p className="mb-1">{t('policies.password_requirements.policy_details_desc')}</p>
          <ul className="mb-1" style={{ listStyleType: 'circle', marginLeft: -24 }}>
            {
              policy?.config?.minLength > 0 && <li className="mb-1">
                {t('policies.password_requirements.minimum_password_length', { length: policy?.config?.minLength })}
              </li>
            }
            {
              policy?.config?.requireSpecialCharacter && <li className="mb-1">
                {t('policies.password_requirements.requires_special_character')}
              </li>
            }
            {
              policy?.config?.requireLowerCase && <li className="mb-1">
                {t('policies.password_requirements.requires_lowercase')}
              </li>
            }
            {
              policy?.config?.requireUpperCase && <li className="mb-1">
                {t('policies.password_requirements.requires_uppercase')}
              </li>
            }
            {
              policy?.config?.requireDigit && <li className="mb-1">
                {t('policies.password_requirements.requires_digit')}
              </li>
            }
          </ul>
          <p className="mb-1">{t('policies.password_requirements.note')}</p>
          <p className="mb-1">{t('policies.password_requirements.note_1')}</p>
          {
            violatedItems.length > 0 && <div className="mt-6">
              <div className="flex items-center text-danger font-semibold cursor-pointer">
                <p className="mr-2">{t('policies.password_requirements.violated_items', { number: violatedItems.length })}</p>
                <ArrowRightOutlined />
              </div>
            </div>
          }
        </div>
      }
    </div>
  );
}

export default PasswordRequirements;