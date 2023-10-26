import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Form,
  Drawer,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import ShareOption from './form-data/ShareOption';
import ItemsShare from './form-data/ItemsShare';
import FolderShare from './form-data/FolderShare';
import QuickShare from './form-data/QuickShare';
import ShareMembers from './form-data/ShareMembers';
import Footer from './form-data/Footer';

import global from '../../../../config/global';
import common from '../../../../utils/common';
import sharingServices from '../../../../services/sharing';

import { FolderRequest } from '../../../../core-js/src/models/request';

function FormData(props) {
  const {
    visible = false,
    menuTypes = {},
    menuType = null,
    item = null,
    onClose = () => {},
    onChangeMenuType = () => {}
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const myShares = useSelector((state) => state.share.myShares);
  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const allCollections = useSelector((state) => state.collection.allCollections);

  const [step, setStep] = useState(1);
  const [callingAPI, setCallingAPI] = useState(false);
  const [currentMembers, setCurrentMembers] = useState([])
  const [currentGroups, setCurrentGroups] = useState([])
  const [newMembers, setNewMembers] = useState([])
  const [newGroups, setNewGroups] = useState([])
  const [orgKey, setOrgKey] = useState(null)
  const [sharingKey, setSharingKey] = useState(null)

  const originCipher = useMemo(() => {
    return allCiphers.find((c) => c.id === item?.id)
  }, [allCiphers, item])

  const originCollection = useMemo(() => {
    return allCollections.find((f) => f.id === item?.id)
  }, [allCollections, item])

  const collectionCiphers = useMemo(() => {
    return allCiphers.find((f) => f.folderId === item?.id)
  }, [allCiphers, item])

  useEffect(() => {
    setNewMembers([])
    setNewGroups([])
    if (visible) {
      if (item) {
        setStep(2)
        if (menuType === menuTypes.CIPHERS) {
          form.setFieldsValue({ items: [item.id] })
        } else if (menuType === menuTypes.FOLDERS) {
          form.setFieldsValue({ folder: item.id })
        }
      } else {
        setStep(1)
        if (menuType === menuTypes.CIPHERS) {
          form.setFieldsValue({ items: [] })
        } else if (menuType === menuTypes.FOLDERS) {
          form.setFieldsValue({ folder: null })
        }
      }
      form.setFieldsValue({})
    } else {
      form.resetFields();
      setCallingAPI(false);
    }
  }, [visible, item, menuType])

  useEffect(() => {
    initData();
  }, [item, myShares])

  const initData = async () => {
    if (item?.organizationId) {
      const orgKey = await global.jsCore.cryptoService.getOrgKey(item.organizationId)
      setOrgKey(orgKey)
    } else {
      const shareKey = await global.jsCore.cryptoService.makeShareKey()
      setSharingKey(shareKey ? shareKey[0].encryptedString : null)
      setOrgKey(shareKey[1])
    }
    const share = myShares.find(s => s.id === item?.organizationId) || { members: [], groups: [] }
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
        closable={step === 1 || item}
        onClose={step === 1 || item ? onClose : () => {}}
        open={visible}
        footer={
          <Footer
            form={form}
            step={step}
            callingAPI={callingAPI}
            onClose={onClose}
            item={item}
            orgKey={orgKey}
            originCipher={originCipher}
            originCollection={originCollection}
            collectionCiphers={collectionCiphers}
            sharingKey={sharingKey}
            newMembers={newMembers}
            newGroups={newGroups}
            setStep={setStep}
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
                />
              }
              {
                menuType !== menuTypes.QUICK_SHARES && <ShareMembers
                  orgKey={orgKey}
                  menuType={menuType}
                  menuTypes={menuTypes}
                  cipherOrFolder={item}
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
