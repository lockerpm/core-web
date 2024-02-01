import React, { useEffect, useState, useMemo } from "react";
import { Tabs, Avatar, Alert, Tooltip } from '@lockerpm/design';
import { InfoCircleOutlined } from "@ant-design/icons";

import components from "../../../components";

import TableData from "./components/password-health/TableData";
import ListData from "./components/password-health/ListData";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import common from "../../../utils/common";
import global from "../../../config/global";
import commonServices from "../../../services/common";
import { red, green } from '@ant-design/colors';
import { CipherType } from "../../../core-js/src/enums";

const menus = [
  {
    key: 'weak_passwords',
  },
  {
    key: 'reused_passwords',
  },
  {
    key: 'exposed_passwords',
  }
]

const PasswordHealth = (props) => {
  const { PageHeader, ImageIcon } = components;
  const { } = props;
  const { t } = useTranslation();
  const location = useLocation();
  const currentPage = common.getRouterByLocation(location);

  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const isMobile = useSelector((state) => state.system.isMobile)

  const [activeKey, setActiveKey] = useState(currentPage.query?.active_key || menus[0].key);
  const [exposedCiphers, setExposedCiphers] = useState([]);

  const ciphersWithPasswords = useMemo(() => {
    return allCiphers
      .filter((c) => c.type === CipherType.Login && !c.isDeleted)
  }, [allCiphers])

  const weakPasswordsData = useMemo(() => {
    return ciphersWithPasswords
      .map((c) => {
        const { score } = commonServices.password_strength(c.login.password)
        return {
          ...c,
          score: score
        }
      })
      .filter(c => c.score <= 2)
      .sort((c1, c2) => c1.score - c2.score)
  }, [ciphersWithPasswords])

  const reusedPasswordsData = useMemo(() => {
    const passwordUseMap = new Map();
    ciphersWithPasswords
      .filter((c) => !!c.login.password)
      .forEach(c => {
        if (passwordUseMap.has(c.login.password)) {
          passwordUseMap.set(
            c.login.password,
            passwordUseMap.get(c.login.password) + 1
          )
        } else {
          passwordUseMap.set(c.login.password, 1)
        }
      });
    return ciphersWithPasswords.filter(c =>
      passwordUseMap.has(c.login.password) &&
      passwordUseMap.get(c.login.password) > 1
    ).map((c) => ({ ...c, usedCount: passwordUseMap.get(c.login.password) }))
  }, [ciphersWithPasswords])

  const data = useMemo(() => {
    if (activeKey === 'weak_passwords') {
      return weakPasswordsData
    }
    if (activeKey === 'reused_passwords') {
      return reusedPasswordsData
    }
    return exposedCiphers
  }, [allCiphers, activeKey, exposedCiphers])

  useEffect(() => {
    getExposedCiphers();
  }, [ciphersWithPasswords])

  const getExposedCiphers = async () => {
    const promises = []
    const exposedPasswordCiphers = []
    ciphersWithPasswords
      .filter((c) => !!c.login.password)
      .forEach(c => {
        const promise = global.jsCore.auditService
          .passwordLeaked(c.login.password)
          .then(exposedCount => {
            if (exposedCount > 0) {
              exposedPasswordCiphers.push({
                ...c,
                exposedCount
              })
            }
          })
        promises.push(promise);
      });
    await Promise.all(promises);
    setExposedCiphers(exposedPasswordCiphers);
  }

  const handleChangeActiveKey = (v) => {
    setActiveKey(v);
    global.navigate(currentPage.name, {}, { active_key: v });
  }

  const getCountByKey = (key) => {
    if (key === 'weak_passwords') {
      return weakPasswordsData.length
    }
    if (key === 'reused_passwords') {
      return reusedPasswordsData.length
    }
    return exposedCiphers.length
  }

  return (
    <div className="password-health layout-content">
      <PageHeader
        title={t('security_tools.password_health.title')}
        subtitle={t('security_tools.password_health.description')}
        actions={[]}
        Logo={() => <ImageIcon
          name="security-tools/pw-health"
          className="mr-4"
          width={48}
          height={48}
        />}
      />
      <Tabs
        activeKey={activeKey}
        items={menus.map((m) => {
          return {
            key: m.key,
            label: (
              <span className="font-semibold">
                {
                  m.key === 'exposed_passwords' ? <ImageIcon
                    name="security-tools/pw-breach"
                    className="mr-2"
                    width={28}
                    height={28}
                  /> : <Avatar
                    size={28}
                    className="mr-2"
                    shape="square"
                    style={{ backgroundColor: getCountByKey(m.key) > 0 ? red[4] : green[6] }}
                  >
                    {getCountByKey(m.key)}
                  </Avatar>
                }
                <span>
                  <span className="mr-1">{t(`security_tools.password_health.${m.key}.title`)}</span>
                  <Tooltip title={t(`security_tools.password_health.${m.key}.description`)}>
                    <InfoCircleOutlined style={{ fontSize: 16, marginRight: 0 }}/>
                  </Tooltip>
                </span>
              </span>
            ),
            children: <div>
              <Alert
                style={{ padding: 12 }}
                message={
                  <p
                    className="font-semibold"
                    style={{ color: getCountByKey(m.key) > 0 ? red[4] : green[6] }}
                  >
                    { getCountByKey(m.key) > 0
                      ? t(`security_tools.password_health.${activeKey}.alert_title`).toUpperCase()
                      : t('security_tools.password_health.good_news').toUpperCase()
                    }
                  </p>
                }
                description={ getCountByKey(m.key) > 0
                  ? t(`security_tools.password_health.${activeKey}.alert_description`, { count: getCountByKey(m.key) })
                  : t('security_tools.password_health.good_news_details')
                }
                type={getCountByKey(m.key) > 0 ? 'warning' : 'success'}
              />
              {
                getCountByKey(m.key) > 0 && <div>
                  {
                    !isMobile && <TableData
                      className="mt-4"
                      activeKey={activeKey}
                      data={data}
                    />
                  }
                   {
                    isMobile && <ListData
                      className="mt-4"
                      activeKey={activeKey}
                      data={data}
                    />
                  }
                </div>
              }
            </div>,
          };
        })}
        onChange={(v) => handleChangeActiveKey(v)}
      />
    </div>
  );
}

export default PasswordHealth;