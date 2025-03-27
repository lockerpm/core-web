import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  List,
  Divider,
  Row,
  Col,
  Image,
  Space
} from '@lockerpm/design';

import { } from "@ant-design/icons";

import itemsComponents from "../items";
import folderComponents from "../folder";
import commonComponents from "../common";
import cipherFormItemComponents from "./form-item";
import inAppShareComponents from "../in-app-share";

import { CipherType, FieldType } from "../../core-js/src/enums";

import common from "../../utils/common";
import global from "../../config/global";

const DetailList = (props) => {
  const { TextCopy, PasswordStrength } = itemsComponents;
  const { DisplayOtp } = commonComponents;
  const { SeedPhrase } = cipherFormItemComponents;
  const { SharedWith } = inAppShareComponents;
  const FolderName = folderComponents.Name;

  const {
    className,
    cipher,
    loading,
    showText = true,
    isPublic = false
  } = props;

  const { t } = useTranslation();
  const locale = useSelector((state) => state.system.locale);

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
            show={showText}
            align="between"
          />
        },
        {
          key: 'password',
          name: t('cipher.password.password'),
          value: <TextCopy
            value={cipher.login.password}
            showIcon={true}
            defaultShow={false}
            show={showText}
            align="between"
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
              <DisplayOtp
                notes={cipher.login.totp}
                showText={showText}
              />
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
            show={showText}
            limited={false}
            align="between"
          />
        },
        {
          key: 'notes',
          name: t('cipher.notes'),
          value: <TextCopy
            value={CipherType.MasterPassword === cipher.type ? t('cipher.master_password_note') : cipher?.notes}
            limited={false}
            showIcon={true}
            show={showText}
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
            show={showText}
            align="between"
          />
        },
        {
          key: 'brand',
          name: t('cipher.card.brand'),
          value: <TextCopy
            value={cipher.card.brand}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'card_number',
          name: t('cipher.card.card_number'),
          value: <TextCopy
            value={cipher.card.number}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'expiration_month',
          name: t('cipher.card.expiration_month'),
          value: <TextCopy
            value={cipher.card.expMonth}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'expiration_year',
          name: t('cipher.card.expiration_year'),
          value: <TextCopy
            value={cipher.card.expYear}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'security_code',
          name: t('cipher.card.security_code'),
          value: <TextCopy
            value={cipher.card.code}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'notes',
          name: t('cipher.notes'),
          value: <TextCopy
            value={cipher?.notes}
            showIcon={true}
            show={showText}
            limited={false}
            align="between"
          />
        },
      ]
    }
    if (cipher.type === CipherType.CryptoWallet) {
      const alias = global.constants.WALLET_APPS.find((a) => a.alias === cipher.cryptoWallet?.walletApp?.alias)
      return [
        {
          key: 'wallet_app',
          name: t('cipher.crypto_backup.wallet_app'),
          value: alias ? <div>
            <Image
              className={'mr-2 rounded-md'}
              style={{ width: 28, height: 28 }}
              preview={false}
              src={alias.icon}
            />
            {cipher.cryptoWallet?.walletApp.name}
          </div> : <></>
        },
        {
          key: 'username',
          name: t('cipher.password.username'),
          value: <TextCopy
            value={cipher.cryptoWallet?.username}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'password',
          name: t('cipher.password.password'),
          value: <TextCopy
            value={cipher.cryptoWallet?.password}
            showIcon={true}
            show={showText}
            defaultShow={false}
            align="between"
          />
        },
        {
          key: 'password_strength',
          name: t('common.password_strength'),
          value: <PasswordStrength
            password={cipher.cryptoWallet?.password}
            showProgress={false}
          />
        },
        {
          key: 'pin',
          name: t('cipher.crypto_backup.pin'),
          value: <TextCopy
            value={cipher.cryptoWallet?.pin}
            showIcon={true}
            show={showText}
            defaultShow={false}
            align="between"
          />
        },
        {
          key: 'wallet_address',
          name: t('cipher.crypto_backup.wallet_address'),
          value: <TextCopy
            value={cipher.cryptoWallet?.address}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'private_key',
          name: t('cipher.crypto_backup.private_key'),
          value: <TextCopy
            value={cipher.cryptoWallet?.privateKey}
            showIcon={true}
            show={showText}
            defaultShow={false}
            align="between"
          />
        },
        {
          key: 'seed',
          name: t('cipher.crypto_backup.seed_phrase'),
          value: <TextCopy
            value={cipher.cryptoWallet?.seed}
            showIcon={true}
            align="between"
            display={
              <SeedPhrase
                className="w-3/4"
                value={common.formatText(cipher.cryptoWallet?.seed, showText)}
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
              (cipher.cryptoWallet?.networks || []).map((n) => {
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
        {
          key: 'notes',
          name: t('cipher.notes'),
          value: <TextCopy
            value={cipher?.cryptoWallet?.notes}
            showIcon={true}
            show={showText}
            limited={false}
            align="between"
          />
        },
      ]
    }
    if (cipher.type === CipherType.Identity) {
      return [
        {
          key: 'personal_title',
          name: t('cipher.identity.personal_title'),
          value: <TextCopy
            value={cipher.identity?.title ? t(`common.${cipher.identity?.title}`) : ''}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'first_name',
          name: t('cipher.identity.first_name'),
          value: <TextCopy
            value={cipher.identity?.firstName}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'last_name',
          name: t('cipher.identity.last_name'),
          value: <TextCopy
            value={cipher.identity?.lastName}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'username',
          name: t('cipher.identity.username'),
          value: <TextCopy
            value={cipher.identity?.username}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'company',
          name: t('cipher.identity.company'),
          value: <TextCopy
            value={cipher.identity?.company}
            showIcon={true}
            show={showText}
            limited={false}
            align="between"
          />
        },
        {
          key: 'email',
          name: t('cipher.identity.email'),
          value: <TextCopy
            value={cipher.identity?.email}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'phone',
          name: t('cipher.identity.phone'),
          value: <TextCopy
            value={cipher.identity?.phone}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'social_security_number',
          name: t('cipher.identity.social_security_number'),
          value: <TextCopy
            value={cipher.identity?.ssn}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'passport_number',
          name: t('cipher.identity.passport_number'),
          value: <TextCopy
            value={cipher.identity?.passportNumber}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'license_number',
          name: t('cipher.identity.license_number'),
          value: <TextCopy
            value={cipher.identity?.licenseNumber}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'address1',
          name: t('cipher.identity.address1'),
          value: <TextCopy
            value={cipher.identity?.address1}
            showIcon={true}
            show={showText}
            limited={false}
            align="between"
          />
        },
        {
          key: 'address2',
          name: t('cipher.identity.address2'),
          value: <TextCopy
            value={cipher.identity?.address2}
            showIcon={true}
            show={showText}
            limited={false}
            align="between"
          />
        },
        {
          key: 'city_town',
          name: t('cipher.identity.city_town'),
          value: <TextCopy
            value={cipher.identity?.city}
            showIcon={true}
            show={showText}
            limited={false}
            align="between"
          />
        },
        {
          key: 'state_province',
          name: t('cipher.identity.state_province'),
          value: <TextCopy
            value={cipher.identity?.state}
            showIcon={true}
            show={showText}
            limited={false}
            align="between"
          />
        },
        {
          key: 'zip_postal',
          name: t('cipher.identity.zip_postal'),
          value: <TextCopy
            value={cipher.identity?.postalCode}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'country',
          name: t('cipher.identity.country'),
          value: <TextCopy
            value={cipher.identity?.country}
            showIcon={true}
            show={showText}
            align="between"
          />
        },
        {
          key: 'notes',
          name: t('cipher.notes'),
          value: <TextCopy
            value={cipher?.notes}
            showIcon={true}
            show={showText}
            limited={false}
            align="between"
          />
        },
      ]
    }
    return [
      {
        key: 'notes',
        name: t('cipher.notes'),
        value: <TextCopy
          value={cipher?.notes}
          showIcon={true}
          show={showText}
          limited={false}
          align="between"
        />
      },
    ]
  }, [cipher, showText, locale])

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
          show={showText}
          align="between"
        />
      },
      ...cipherTypeData,
      ...(cipher.fields || []).map((f) => {
        let newValue = f.value;
        if (f.type === FieldType.Date) {
          const dateValue = common.convertCipherFieldDate(f.value);
          newValue = common.convertDateTime(dateValue, 'DD-MM-YYYY')
        }
        return {
          key: f.key,
          name: f.name,
          value: <TextCopy
            value={newValue}
            showIcon={true}
            show={showText}
            defaultShow={f.type !== FieldType.Hidden}
            align="between"
          />
        }
      }),
      {
        key: 'owner',
        name: t('roles.owner'),
        hide: isPublic || common.isProtectedCipher(cipher),
        value: <div>
          {
            common.isOwner(cipher) ? t('common.me') : common.getOrganization(cipher.organizationId)?.name || null
          }
        </div>
      },
      {
        key: 'folder',
        name: t('common.folder'),
        hide: isPublic || common.isProtectedCipher(cipher),
        value: (cipher.folderId || cipher.collectionIds.length) ? <FolderName
          item={{ id: cipher.folderId || cipher.collectionIds[0] }}
          showItems={false}
        /> : <></>
      },
      {
        key: 'created_time',
        name: t('common.created_time'),
        hide: isPublic || common.isProtectedCipher(cipher),
        value: <TextCopy
          value={common.timeFromNow(cipher.creationDate)}
          showIcon={true}
          align={'between'}
        />
      },
      {
        key: 'updated_time',
        name: t('common.updated_time'),
        hide: isPublic || common.isProtectedCipher(cipher),
        value: <TextCopy
          value={common.timeFromNow(cipher.revisionDate)}
          showIcon={true}
          align={'between'}
        />
      },
      {
        key: 'shared_with',
        name: t('shares.shared_with'),
        hide: !cipher?.organizationId || isPublic || common.isProtectedCipher(cipher),
        value: <SharedWith
          cipher={cipher}
          className="flex items-center"
          justify="start"
        />
      },
    ].filter((c) => !c.hide).map((c) => { delete c.hide; return c })
  }, [
    cipher,
    cipherTypeData,
    isPublic,
    showText,
    locale
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
      <Divider className="my-1" />
    </div>
  );
}

export default DetailList;