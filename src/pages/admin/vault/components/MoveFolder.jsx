import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Form,
  Space,
  Button,
  Drawer,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import SelectFolder from './form-items/SelectFolder';
import FolderFormData from "../../folders/components/FormData";

import global from '../../../../config/global';
import common from '../../../../utils/common';
import sharingServices from '../../../../services/sharing';
import cipherServices from '../../../../services/cipher';

function MoveFolder(props) {
  const {
    visible = false,
    cipherIds = [],
    onClose = () => {},
  } = props
  const { t } = useTranslation();
  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const allCollections = useSelector((state) => state.collection.allCollections)

  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);
  const [folderVisible, setFolderVisible] = useState(false);

  const folderId = Form.useWatch('folderId', form)

  useEffect(() => {
    if (visible) {
      const cipher = allCiphers.find((c) => c.id === cipherIds[0])
      form.setFieldsValue({ folderId: cipher?.folderId || cipher?.collectionIds[0] || '' });
    } else {
      setCallingAPI(false);
    }
  }, [visible, cipherIds, allCiphers])


  const handleSave = async () => {
    form.validateFields().then(async () => {
      setCallingAPI(true);
      const collection = allCollections.find(c => c.id === folderId)
      const personalKey = await global.jsCore.cryptoService.getEncKey()
      try {
        const ciphers = await Promise.all(cipherIds.map(async (id) => {
          const encCipher = await global.jsCore.cipherService.get(id)
          const decCipher = await encCipher.decrypt()
          return { ...decCipher, id }
        }))
        // Remove from collection
        const removeRequests = ciphers.map((cipher) => removeFromCollection(cipher, personalKey));
        await Promise.all(removeRequests);
  
        if (collection) {
          // Remove from current folder
          await cipherServices.move({ ids: cipherIds, folderId: null })
          const orgKey = await global.jsCore.cryptoService.getOrgKey(collection.organizationId)
          const addRequests = ciphers.map((cipher) => addToCollection(cipher, orgKey, collection));
          await Promise.all(addRequests)
        } else {
          await cipherServices.move({ ids: cipherIds, folderId: folderId || null })
        }
        global.pushSuccess(t('notification.success.cipher.moved'))
        onClose();
      } catch (error) {
        global.pushError(error)
      }
      setCallingAPI(false);
    })
  }

  const removeFromCollection = async (cipher, personalKey) => {
    if (cipher.collectionIds?.length) {
      const { data } = await common.getEncCipherForRequest(cipher, {
        noCheck: true,
        encKey: personalKey
      })
      await sharingServices.update_sharing_folder_items(
        cipher.organizationId,
        cipher.collectionIds[0],
        { cipher: { ...data, id: cipher.id }}
      )
    }
  }

  const addToCollection = async (cipher, orgKey, collection) => {
    const { data } = await common.getEncCipherForRequest(cipher, {
      noCheck: true,
      encKey: orgKey
    })
    await sharingServices.add_sharing_folder_items(
      collection.organizationId,
      collection.id,
      { cipher: { ...data, id: cipher.id }}
    )
  }


  return (
    <div className={props.className}>
      <Drawer
        title={t( 'inventory.move_to.title')}
        placement="right"
        onClose={onClose}
        open={visible}
        footer={
          <Space className='flex items-center justify-end'>
            <Button
              disabled={callingAPI}
              onClick={onClose}
            >
              {t('button.cancel')}
            </Button>
            <Button
              type="primary"
              loading={callingAPI}
              onClick={handleSave}
            >
            { t('button.update') } 
            </Button>
          </Space>
        }
      >
        <p className='mb-2'>
          {t('inventory.move_to.description', { amount: cipherIds.length })}
        </p>
        <Form
          form={form}
          layout="vertical"
          labelAlign={'left'}
        >
          <SelectFolder
            disabled={callingAPI}
            isMove={true}
            onCreate={() => setFolderVisible(true)}
          />
        </Form>
      </Drawer>
      <FolderFormData
        visible={folderVisible}
        onClose={() => setFolderVisible(false)}
        callback={(res) => {
          setTimeout(() => {
            form.setFieldValue('folderId', res.id)
          }, 2000);
        }}
      />
    </div>
  );
}

export default MoveFolder;
