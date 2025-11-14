import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import {
  Space,
  Button,
  Drawer,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import cipherComponents from '../../../../components/cipher';
import commonComponents from '../../../../components/common';

import global from '../../../../config/global';
import common from '../../../../utils/common';

function DetailData(props) {
  const { DetailList } = cipherComponents;
  const { CipherIcon } = commonComponents;
  const location = useLocation();
  const { t } = useTranslation();
  const {
    visible = false,
    item = null,
    onClose = () => {},
  } = props;
  const currentPage = common.getRouterByLocation(location);
  const allCiphers = useSelector((state) => state.cipher.allCiphers);

  const send = useMemo(() => {
    if (item?.cipher) {
      return item
    }
    return null
  }, [item])

  const originCipher = useMemo(() => {
    return allCiphers.find((d) => send?.cipherId ? send?.cipherId === d.id : d.id === item?.id)
  }, [allCiphers, item, send])

  const cipherType = useMemo(() => {
    return common.cipherTypeInfo('listRouter', currentPage.name, originCipher?.type)
  }, [originCipher, currentPage])

  const routerName = useMemo(() => {
    return common.getCipherRouterName(currentPage, cipherType);
  }, [currentPage, cipherType])

  const routerParams = useMemo(() => {
    return common.getCipherRouterParams(currentPage, originCipher?.id, send?.id)
  }, [
    originCipher,
    currentPage,
    send
  ])

  const viewFullPage = () => {
    global.navigate(routerName, routerParams, currentPage.query)
  }

  return (
    <div className={props.className}>
      <Drawer
        className="vault-form-drawer"
        title={!originCipher ? <></> : <div className='flex items-center gap-4'>
          <CipherIcon
            size={32}
            item={originCipher}
            type={originCipher.type}
            isDeleted={originCipher?.isDeleted}
          />
          <p className='font-semibold w-full text-limited text-xl'>
            {originCipher?.name}
          </p>
        </div>}
        placement="right"
        onClose={onClose}
        open={visible}
        width={600}
        footer={
          <Space className='flex items-center justify-end'>
            <Button
              className="vault-form-close-btn"
              onClick={onClose}
            >
              {t('button.cancel')}
            </Button>
            <Button
              className="vault-form-save-btn"
              type="primary"
              onClick={viewFullPage}
            >
            { t('button.view_full_page') } 
            </Button>
          </Space>
        }
      >
        <DetailList
          cipher={originCipher}
          isDrawer
        />
      </Drawer>
    </div>
  );
}

export default DetailData;
