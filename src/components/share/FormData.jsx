import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Form,
  Drawer,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import shareFormDataComponents from './form-data';

import sharingServices from '../../services/sharing';

import { FolderRequest } from '../../core-js/src/models/request';

import global from '../../config/global';
import common from '../../utils/common';

const shareWithOptions = {
  ANYONE: 0,
  ONLY_SOME: 1
}

const expirationOptions = {
  AN_HOUR: 60 * 60 * 1,
  A_DAY: 60 * 60 * 24,
  A_WEEK: 60 * 60 * 24 * 7,
  DAYS: 60 * 60 * 24 * 14,
  A_MONTH: 60 * 60 * 24 * 30,
  NO_EXPIRATION: null
}

const countAccessOptions = {
  UNLIMITED: 0,
  TIMES_ACCESS: 1
}

function FormData(props) {
  const {
    ShareOption,
    ItemsShare,
    FolderShare,
    QuickShare,
    ShareMembers,
    Footer
  } = shareFormDataComponents;
  const {
    visible = false,
    menuTypes = {},
    menuType = null,
    item = null,
    onClose = () => {},
    onReview = () => {},
    onChangeMenuType = () => {}
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const myShares = useSelector((state) => state.share.myShares);
  const allCiphers = useSelector((state) => state.cipher.allCiphers);
  const allFolders = useSelector((state) => state.folder.allFolders)
  const allCollections = useSelector((state) => state.collection.allCollections);

  const [step, setStep] = useState(1);
  const [callingAPI, setCallingAPI] = useState(false);
  const [currentMembers, setCurrentMembers] = useState([])
  const [currentGroups, setCurrentGroups] = useState([])
  const [newMembers, setNewMembers] = useState([])
  const [newGroups, setNewGroups] = useState([])
  const [orgKey, setOrgKey] = useState(null)
  const [sharingKey, setSharingKey] = useState(null)

  const folderId = Form.useWatch('folderId', form)

  const originCipher = useMemo(() => {
    return allCiphers.find((c) => c.id === item?.id)
  }, [allCiphers, item])

  const originCollection = useMemo(() => {
    if (item) {
      return allCollections.find((f) => f.id === item?.id) || allFolders.find((f) => f.id === item?.id)
    }
    return allCollections.find((f) => f.id === folderId) || allFolders.find((f) => f.id === folderId)
  }, [allCollections, item, folderId])

  const collectionCiphers = useMemo(() => {
    return allCiphers.filter((f) => f.folderId === originCollection?.id)
  }, [allCiphers, item, originCollection])

  useEffect(() => {
    setNewMembers([])
    setNewGroups([])
    if (visible) {
      if (item) {
        setStep(2)
        if (menuType === menuTypes.CIPHERS) {
          form.setFieldsValue({ items: [item.id] })
        } else if (menuType === menuTypes.FOLDERS) {
          form.setFieldsValue({ folderId: item.id })
        } else {
          form.setFieldsValue({
            cipherId: item.id,
            emails: [],
            requireOtp: shareWithOptions.ANYONE,
            expireAfter: expirationOptions.AN_HOUR,
            maxAccessCount: 1,
            countAccess: countAccessOptions.UNLIMITED
          })
        }
      } else {
        setStep(1)
        if (menuType === menuTypes.CIPHERS) {
          form.setFieldsValue({ items: [] })
        } else if (menuType === menuTypes.FOLDERS) {
          form.setFieldsValue({ folderId: null })
        } else {
          form.setFieldsValue({
            emails: [],
            requireOtp: shareWithOptions.ANYONE,
            expireAfter: expirationOptions.AN_HOUR,
            maxAccessCount: 1,
            countAccess: countAccessOptions.UNLIMITED
          })
        }
      }
      form.setFieldsValue({})
    } else {
      form.resetFields();
      setCallingAPI(false);
    }
  }, [visible, item, menuType])

  useEffect(() => {
    if (visible) {
      initData();
    }
  }, [visible, item, myShares, originCollection, menuType])

  const initData = async () => {
    if (menuType !== menuTypes.QUICK_SHARES) {
      const organizationId = item?.organizationId || originCollection?.organizationId
      if (organizationId) {
        const orgKey = await global.jsCore.cryptoService.getOrgKey(organizationId)
        setOrgKey(orgKey)
      } else {
        const shareKey = await global.jsCore.cryptoService.makeShareKey()
        setSharingKey(shareKey ? shareKey[0].encryptedString : null)
        setOrgKey(shareKey[1])
      }
      const share = myShares.find(s => s.id === organizationId) || { members: [], groups: [] }
      setCurrentMembers(share.members.map(member => ({
        ...member,
        username: member.email,
        status: member.status,
        role: member.role,
        id: member.id,
        key: null
      })))
      setCurrentGroups(share.groups.map(group => ({
        ...group,
        type: 'group',
        key: null
      })))
    }
  }

  const shareMembersGroups = useMemo(() => {
    return [
      ...currentMembers,
      ...newMembers,
      ...currentGroups,
      ...newGroups,
    ]
  }, [currentMembers, currentGroups, newGroups, newMembers])

  const formTitle = useMemo(() => {
    const title = t('shares.no_data.add')
    if (menuType === menuTypes.QUICK_SHARES) {
      return t('shares.new_share.get_shareable_link')
    }
    if (item) {
      return menuType === menuTypes.CIPHERS ? t('shares.share_items') : t('shares.share_folder')
    }
    if (step === 2) {
      return `${title} ${menuType ===  menuTypes.CIPHERS ? t('common.items') : t('common.folder')}`
    }
    return title
  }, [step, menuType, item])

  const stopSharingCipher = async (row) => {
    try {
      const personalKey = await global.jsCore.cryptoService.getEncKey()
      const { data } = await common.getEncCipherForRequest(originCipher, {
        noCheck: true,
        encKey: personalKey
      })
      const payload = {
        folder: null,
        cipher: { ...data, id: originCipher.id }
      }
      if (row.type === 'group') {
        await sharingServices.stop_sharing_group(originCipher.organizationId, row.id, payload)
      } else {
        await sharingServices.stop_sharing_member(originCipher.organizationId, row.id, payload)
      }
      global.pushSuccess(t('notification.success.sharing.stop_share_success'))
      if ([...currentMembers, ...currentGroups].length <= 1) {
        onClose();
      }
    } catch (error) {
      global.pushError(error)
    }
  }

  const stopSharingFolder = async (row) => {
    const personalKey = await global.jsCore.cryptoService.getEncKey()
    const folderEnc = await global.jsCore.folderService.encrypt(
      originCollection,
      personalKey
    )
    const data = new FolderRequest(folderEnc)
    const ciphers = await Promise.all(
      collectionCiphers.map(async cipher => {
        const { data } = await common.getEncCipherForRequest(cipher, {
          noCheck: true,
          encKey: personalKey
        })
        return {
          id: cipher.id,
          ...data
        }
      })
    )
    const payload = {
      folder: { ...data, id: item.id, ciphers },
    }
    await sharingServices.stop_sharing_member(originCollection.organizationId, row.id, payload).then(() => {
      global.pushSuccess(t('notification.success.sharing.stop_share_success'))
      if ([...currentMembers, ...currentGroups].length <= 1) {
        onClose();
      }
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const stopSharing = async (row) => {
    if (originCipher) {
      await stopSharingCipher(row)
    } else {
      await stopSharingFolder(row)
    }
  }

  return (
    <div className={props.className}>
      <Drawer
        title={formTitle}
        placement="right"
        width={500}
        onClose={onClose}
        open={visible}
        footer={
          <Footer
            form={form}
            step={step}
            menuType={menuType}
            menuTypes={menuTypes}
            callingAPI={callingAPI}
            item={item}
            orgKey={orgKey}
            originCipher={originCipher}
            originCollection={originCollection}
            collectionCiphers={collectionCiphers}
            sharingKey={sharingKey}
            newMembers={newMembers}
            newGroups={newGroups}
            setStep={setStep}
            onClose={onClose}
            onReview={onReview}
            setCallingAPI={setCallingAPI}
          />
        }
      >
        <Form
          form={form}
          layout="vertical"
          labelAlign={'left'}
          disabled={callingAPI}
        >
          {
            step === 1 && <ShareOption
              menuTypes={menuTypes}
              menuType={menuType}
              onChange={onChangeMenuType}
            />
          }
          {
            step === 2 && <div>
              {
                menuType === menuTypes.CIPHERS && <ItemsShare
                  item={item}

                />
              }
              {
                menuType === menuTypes.FOLDERS && <FolderShare
                  item={item}
                />
              }
              {
                menuType === menuTypes.QUICK_SHARES && <QuickShare
                  item={item}
                  form={form}
                  shareWithOptions={shareWithOptions}
                  expirationOptions={expirationOptions}
                  countAccessOptions={countAccessOptions}
                />
              }
              {
                menuType !== menuTypes.QUICK_SHARES && <ShareMembers
                  orgKey={orgKey}
                  menuType={menuType}
                  menuTypes={menuTypes}
                  cipherOrFolder={originCipher || originCollection}
                  currentMembers={currentMembers}
                  currentGroups={currentGroups}
                  newMembers={newMembers}
                  newGroups={newGroups}
                  shareMembersGroups={shareMembersGroups}
                  setCurrentMembers={setCurrentMembers}
                  setCurrentGroups={setCurrentGroups}
                  setNewMembers={setNewMembers}
                  setNewGroups={setNewGroups}
                  stopSharing={stopSharing}
                />
              }
            </div>
          }
        </Form>
      </Drawer>
    </div>
  );
}

export default FormData;
