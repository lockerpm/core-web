import React, { useEffect, useMemo } from "react";
import {
  List,
  Divider,
  Row,
  Col,
  Image,
  Space
} from '@lockerpm/design';
import { } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { TextCopy, PasswordStrength } from "../../../../../components";
import { CipherType } from "../../../../../core-js/src/enums";

import FolderName from "../../../folders/components/table/Name";
import SharedWith from "../../../shares/components/in-app-shares/table/SharedWith";
import DisplayOtp from "../../../otps/components/table/DisplayOtp";
import SeedPhrase from "../form-items/crypto-backup/SeedPhrase";

import common from "../../../../../utils/common";
import global from "../../../../../config/global";

const ListItemDetails = (props) => {
  const {
    className,
    cipher,
    loading,
    isEmergencyAccess = false
  } = props;
  const { t } = useTranslation();

  const cipherTypeData = useMemo(() => {
    if (!cipher) {
      return []
    }
    if ([CipherType.Login, CipherType.MasterPassword].includes(cipher.type)) {
      return [
        {
          key: 'username',
          name: t('cipher.password.username'),
          value: <TextCopy
            value={cipher.login.username}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'password',
          name: t('cipher.password.password'),
          value: <TextCopy
            value={cipher.login.password}
            showIcon={true}
            isPassword={true}
          />
        },
        {
          key: 'totp',
          name: t('cipher.password.totp'),
          hide: !cipher.login.totp,
          value: <TextCopy
            value={common.getTOTP(cipher.login.totp)}
            showIcon={true}
            align="between"
            display={
              <DisplayOtp notes={cipher.login.totp}/>
            }
          />
        },
        {
          key: 'password_strength',
          name: t('common.password_strength'),
          value: <PasswordStrength
            password={cipher.login.password}
            showProgress={false}
          />
        },
        {
          key: 'website',
          name: t('cipher.password.website'),
          value: <TextCopy
            value={cipher.login.uri}
            showIcon={true}
            align="between"
          />
        },
      ]
    }
    if (cipher.type === CipherType.Card) {
      return [
        {
          key: 'cardholder_name',
          name: t('cipher.card.cardholder_name'),
          value: <TextCopy
            value={cipher.card.cardholderName}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'brand',
          name: t('cipher.card.brand'),
          value: <TextCopy
            value={cipher.card.brand}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'card_number',
          name: t('cipher.card.card_number'),
          value: <TextCopy
            value={cipher.card.number}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'expiration_month',
          name: t('cipher.card.expiration_month'),
          value: <TextCopy
            value={cipher.card.expMonth}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'expiration_year',
          name: t('cipher.card.expiration_year'),
          value: <TextCopy
            value={cipher.card.expYear}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'security_code',
          name: t('cipher.card.security_code'),
          value: <TextCopy
            value={cipher.card.code}
            showIcon={true}
            align="between"
          />
        },
      ]
    }
    if (cipher.type === CipherType.CryptoWallet) {
      return [
        {
          key: 'wallet_app',
          name: t('cipher.crypto_backup.wallet_app'),
          value: cipher.cryptoWallet.walletApp ? <div>
            <Image
              className={'mr-2'}
              style={{ width: 28, height: 28 }}
              preview={false}
              src={cipher.cryptoWallet.walletApp.icon}
            />
            {cipher.cryptoWallet.walletApp.name}
          </div> : <></>
        },
        {
          key: 'username',
          name: t('cipher.password.username'),
          value: <TextCopy
            value={cipher.cryptoWallet.username}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'password',
          name: t('cipher.password.password'),
          value: <TextCopy
            value={cipher.cryptoWallet.password}
            showIcon={true}
            isPassword={true}
          />
        },
        {
          key: 'password_strength',
          name: t('common.password_strength'),
          value: <PasswordStrength
            password={cipher.cryptoWallet.password}
            showProgress={false}
          />
        },
        {
          key: 'wallet_address',
          name: t('cipher.crypto_backup.wallet_address'),
          value: <TextCopy
            value={cipher.cryptoWallet.address}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'private_key',
          name: t('cipher.crypto_backup.private_key'),
          value: <TextCopy
            value={cipher.cryptoWallet.privateKey}
            showIcon={true}
            isPassword={true}
          />
        },
        {
          key: 'seed',
          name: t('cipher.crypto_backup.seed_phrase'),
          value: <TextCopy
            value={cipher.cryptoWallet.seed}
            showIcon={true}
            align="between"
            display={
              <SeedPhrase
                className="w-3/4"
                value={cipher.cryptoWallet.seed}
                readOnly={true}
              />
            }
          />
        },
        {
          key: 'networks',
          name: t('cipher.crypto_backup.networks'),
          value: <Space size={[16, 16]} wrap>
            {
              (cipher.cryptoWallet.networks || []).map((n) => {
                const network = global.constants.CHAINS.find((network) => n.alias === network.alias)
                return <div key={network.alias}>
                  <Image
                    className={'mr-1'}
                    style={{ width: 28, height: 28 }}
                    preview={false}
                    src={network.logo}
                  />
                  {network.name}
                </div>
              })
            }
          </Space>
        },
      ]
    }
    if (cipher.type === CipherType.Identity) {
      return [
        {
          key: 'personal_title',
          name: t('cipher.identity.personal_title'),
          value: <TextCopy
            value={cipher.identity.title ? t(`common.${cipher.identity.title}`) : ''}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'first_name',
          name: t('cipher.identity.first_name'),
          value: <TextCopy
            value={cipher.identity.firstName}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'last_name',
          name: t('cipher.identity.last_name'),
          value: <TextCopy
            value={cipher.identity.lastName}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'username',
          name: t('cipher.identity.username'),
          value: <TextCopy
            value={cipher.identity.username}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'company',
          name: t('cipher.identity.company'),
          value: <TextCopy
            value={cipher.identity.company}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'email',
          name: t('cipher.identity.email'),
          value: <TextCopy
            value={cipher.identity.email}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'phone',
          name: t('cipher.identity.phone'),
          value: <TextCopy
            value={cipher.identity.phone}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'social_security_number',
          name: t('cipher.identity.social_security_number'),
          value: <TextCopy
            value={cipher.identity.ssn}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'passport_number',
          name: t('cipher.identity.passport_number'),
          value: <TextCopy
            value={cipher.identity.passportNumber}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'license_number',
          name: t('cipher.identity.license_number'),
          value: <TextCopy
            value={cipher.identity.licenseNumber}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'address1',
          name: t('cipher.identity.address1'),
          value: <TextCopy
            value={cipher.identity.address1}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'address2',
          name: t('cipher.identity.address2'),
          value: <TextCopy
            value={cipher.identity.address2}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'city_town',
          name: t('cipher.identity.city_town'),
          value: <TextCopy
            value={cipher.identity.city}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'state_province',
          name: t('cipher.identity.state_province'),
          value: <TextCopy
            value={cipher.identity.state}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'zip_postal',
          name: t('cipher.identity.zip_postal'),
          value: <TextCopy
            value={cipher.identity.postalCode}
            showIcon={true}
            align="between"
          />
        },
        {
          key: 'country',
          name: t('cipher.identity.country'),
          value: <TextCopy
            value={cipher.identity.country}
            showIcon={true}
            align="between"
          />
        }
      ]
    }
    return []
  }, [cipher])

  const data = useMemo(() => {
    if (!cipher) {
      return []
    }
    return [
      {
        key: 'name',
        name: t('cipher.item_name'),
        value: <TextCopy
          value={cipher?.name}
          showIcon={true}
          align="between"
        />
      },
      ...cipherTypeData,
      {
        key: 'notes',
        name: t('cipher.notes'),
        value: <TextCopy
          value={cipher?.notes}
          showIcon={true}
          align="between"
        />
      },
      ...(cipher.fields || []).map((f) => ({
        key: f.key,
        name: f.name,
        value: <TextCopy
          value={f.value}
          showIcon={true}
          align="between"
        />
      })),
      {
        key: 'owner',
        name: t('roles.owner'),
        hide: isEmergencyAccess,
        value: <div>
          {
            common.isOwner(cipher) ? t('common.me') : common.getOrganization(cipher.organizationId)?.name || null
          }
        </div>
      },
      {
        key: 'folder',
        name: t('common.folder'),
        hide: isEmergencyAccess,
        value: cipher.folderId ? <FolderName
          item={{ id: cipher.folderId }}
          showItems={false}
        /> : <></>
      },
      {
        key: 'created_time',
        name: t('common.created_time'),
        hide: isEmergencyAccess,
        value: <TextCopy
          value={common.timeFromNow(cipher.creationDate)}
          showIcon={true}
          align={'between'}
        />
      },
      {
        key: 'updated_time',
        name: t('common.updated_time'),
        hide: isEmergencyAccess,
        value: <TextCopy
          value={common.timeFromNow(cipher.revisionDate)}
          showIcon={true}
          align={'between'}
        />
      },
      {
        key: 'shared_with',
        name: t('shares.shared_with'),
        hide: !cipher?.organizationId || isEmergencyAccess,
        value: <SharedWith cipher={cipher}/>
      },
    ].filter((c) => !c.hide).map((c) => { delete c.hide; return c })
  }, [
    cipher,
    cipherTypeData,
    isEmergencyAccess
  ])

  return (
    <div className={`item-details ${className}`}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        loading={loading}
        renderItem={(item, index) => (
          <List.Item>
            <Row className="w-full" align={'middle'}>
              <Col lg={8} md={8} sm={24} xs={24}>
                <p className="font-semibold">{item.name}</p>
              </Col>
              <Col lg={16} md={16} sm={24} xs={24}>
                {item.value}
              </Col>
            </Row>
          </List.Item>
        )}
      />
      <Divider className="my-1"/>
    </div>
  );
}

export default ListItemDetails;