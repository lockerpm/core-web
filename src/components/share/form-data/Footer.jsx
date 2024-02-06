import React, { } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Space,
  Button,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import sharingServices from '../../../services/sharing';
import quickShareServices from '../../../services/quick-share';
import commonServices from '../../../services/common';

import global from '../../../config/global';
import common from '../../../utils/common';

function Footer(props) {
  const {
    form = null,
    step = 1,
    callingAPI = false,
    item = null,
    menuType = null,
    menuTypes = {},
    originCipher = null,
    originCollection = null,
    collectionCiphers = [],
    newMembers = [],
    newGroups = [],
    orgKey = null,
    sharingKey = null,
    setStep = () => {},
    onClose = () => {},
    setCallingAPI = () => {},
    onReview = () => {}
  } = props
  const { t } = useTranslation()
  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const handleShare = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      if (values.cipherId) {
        await quickShare(values);
      } else if (!values.items) {
        await shareFolder()
      } else {
        await shareCiphers(values)
      }
      setCallingAPI(false);
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

  const shareCiphers = async (values) => {
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
      onClose();
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const shareCipher = async () => {
    const { data } = await common.getEncCipherForRequest(originCipher, {
      noCheck: true,
      encKey: orgKey
    });
    await sharingServices.share({
      sharing_key: sharingKey,
      cipher: { id: originCipher.id, ...data },
      members: newMembers,
      groups: newGroups
    }).then(() => {
      commonServices.get_my_shares();
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
        id: originCollection.id,
        name: collectionName,
        ciphers
      },
      members: newMembers
    }
    if (originCollection?.organizationId) {
      await sharingServices.add_sharing_members(originCollection.organizationId, payload).then(() => {
        commonServices.get_my_shares();
        global.pushSuccess(t('notification.success.sharing.share_folder_success'))
        onClose();        
      }).catch((error) => {
        global.pushError(error)
      })
    } else {
      await sharingServices.update_sharing(payload).then(() => {
        global.pushSuccess(t('notification.success.sharing.share_folder_success'))
        onClose();
      }).catch((error) => {
        global.pushError(error)
      })
    }
  }

  const quickShare = async (values) => {
    const quickRequest = await common.quickShareForRequest(values);
    await quickShareServices.create(quickRequest).then(async (response) => {
      global.pushSuccess(t('notification.success.sharing.share_folder_success'))
      await commonServices.get_quick_shares();
      onReview(response.id);
      onClose();
    }).catch((error) => {
      global.pushError(error)
    })
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
        step === 2 && menuType === menuTypes.QUICK_SHARES && <Button
          type="primary"
          loading={callingAPI}
          onClick={handleShare}
        >
          { t('shares.new_share.get_shareable_link') } 
        </Button>
      }
      {
        step === 2 && !item && menuType !== menuTypes.QUICK_SHARES && <Button
          type="primary"
          loading={callingAPI}
          onClick={handleShare}
        >
          { t('button.share') } 
        </Button>
      }
      {
        step === 2 && item && menuType !== menuTypes.QUICK_SHARES && <Button
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

export default Footer;
