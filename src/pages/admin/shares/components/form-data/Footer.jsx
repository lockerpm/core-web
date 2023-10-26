import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Space,
  Button,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import global from '../../../../../config/global';
import common from '../../../../../utils/common';
import sharingServices from '../../../../../services/sharing';

function FormData(props) {
  const {
    form = null,
    step = 1,
    callingAPI = false,
    item = null,
    originCipher = null,
    originCollection = null,
    collectionCiphers = [],
    newMembers = [],
    newGroups = [],
    orgKey = null,
    sharingKey = null,
    setStep = () => {},
    onClose = () => {},
    setCallingAPI = () => {}
  } = props
  const { t } = useTranslation()
  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const handleShare = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      const selectedCiphers = allCiphers.filter((c) => values.items.includes(c.id));
      const sharedCiphers = await Promise.all(selectedCiphers.map(async (c) => {
        let _orgKey = orgKey
        if (c.organizationId) {
          _orgKey = await global.jsCore.cryptoService.getOrgKey(c.organizationId)
        }
        const { data } = await common.getEncCipherForRequest(c, {
          noCheck: true,
          encKey: _orgKey
        })
        return {
          cipher: { id: c.id, ...data },
          members: newMembers,
          groups: newGroups
        }
      }))
      await sharingServices.sharing_multiple({
        sharing_key: sharingKey,
        ciphers: sharedCiphers
      }).then(() => {
        global.pushSuccess(t('notification.success.sharing.share_items_success'))
      }).catch((error) => {
        global.pushError(error)
      })
      setCallingAPI(false);
      onClose();
    })
  }

  const handleSave = async () => {
    form.validateFields().then(async () => {
      setCallingAPI(true);
      if (originCipher) {
        await shareCipher()
      } else {
        await shareFolder()
      }
      setCallingAPI(false);
      onClose();
    })
  }

  const shareCipher = async () => {
    const { data } = await common.getEncCipherForRequest(originCipher, {
      noCheck: true,
      encKey: orgKey
    });
    await sharingServices.share({
      sharing_key: sharingKey,
      cipher: { id: item.id, ...data },
      members: newMembers,
      groups: newGroups
    }).then(() => {
      global.pushSuccess(t('notification.success.sharing.update_share_success'))
      onClose();
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const shareFolder = async () => {
    const collection = await global.jsCore.cryptoService.encrypt(
      originCollection.name,
      orgKey
    )
    const collectionName = collection.encryptedString
    const ciphers = await Promise.all(
      collectionCiphers.map(async cipher => {
        const { data } = await common.getEncCipherForRequest(cipher, {
          noCheck: true,
          encKey: orgKey
        })
        return {
          id: cipher.id,
          ...data
        }
      })
    )
    const payload = {
      sharing_key: sharingKey,
      folder: {
        id: item.id,
        name: collectionName,
        ciphers
      },
      members: newMembers
    }
    if (item.organizationId) {
      await sharingServices.add_sharing_members(item.organizationId, payload).then(() => {
        global.pushSuccess(t('notification.success.sharing.share_folder_success'))
      }).catch((error) => {
        global.pushError(error)
      })
    } else {
      await sharingServices.update_sharing(payload).then(() => {
        global.pushSuccess(t('notification.success.sharing.share_folder_success'))
      }).catch((error) => {
        global.pushError(error)
      })
    }
    onClose();
  }

  const handleContinue = () => {
    setStep(step + 1)
  }

  return (
    <Space className='flex items-center justify-end'>
      {
        (step === 1 || item) && <Button
          disabled={callingAPI}
          onClick={onClose}
        >
          {t('button.cancel')}
        </Button>
      }
      {
        (step !== 1 && !item) && <Button
          disabled={callingAPI}
          onClick={() => setStep(step - 1)}
        >
          {t('button.back')}
        </Button>
      }
      {
        step === 1 && <Button
          type="primary"
          onClick={handleContinue}
        >
          { t('button.continue') } 
        </Button>
      }
      {
        step === 2 && !item && <Button
          type="primary"
          loading={callingAPI}
          onClick={handleShare}
        >
          { t('button.share') } 
        </Button>
      }
      {
        step === 2 && item && <Button
          type="primary"
          loading={callingAPI}
          onClick={handleSave}
        >
          { t('button.update') } 
        </Button>
      }
    </Space>
  );
}

export default FormData;
