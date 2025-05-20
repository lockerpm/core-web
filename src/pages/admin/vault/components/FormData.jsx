import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Form,
  Space,
  Button,
  Drawer,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import cipherFormItemComponents from '../../../../components/cipher/form-item';
import cipherFormComponents from '../../../../components/cipher/form';
import foldersComponents from '../../folders/components';
import modalsComponents from '../../../../components/modals';

import { CipherType } from '../../../../core-js/src/enums';

import cipherServices from '../../../../services/cipher';

import global from '../../../../config/global';
import common from '../../../../utils/common';

function FormData(props) {
  const {
    ItemName,
    Notes,
    SelectFolder,
    CustomFields,
    PasswordOTP,
    Attachments
  } = cipherFormItemComponents;
  const {
    PasswordForm,
    CardForm,
    CryptoBackupForm,
    IdentityForm,
  } = cipherFormComponents;

  const {
    PasswordViolatedModal
  } = modalsComponents;

  const FolderFormData = foldersComponents.FormData

  const {
    visible = false,
    item = null,
    cipherType = {},
    cloneMode = false,
    folderId = null,
    isTutorial = false,
    setCloneMode = () => {},
    onClose = () => {},
    otpLimited = false
  } = props

  const { t } = useTranslation();

  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);
  const [folderVisible, setFolderVisible] = useState(false);
  const [violatedVisible, setViolatedVisible] = useState(false);
  const [isCreateOtp, setIsCreateOtp] = useState(false);
  const [policyItem, setPolicyItem] = useState({ violations: [] });
  const [originCipher, setOriginCipher] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [isUpload, setIsUpload] = useState(false);

  const allCiphers = useSelector((state) => state.cipher.allCiphers);
  const allCollections = useSelector((state) => state.collection.allCollections)

  const cipherTypes = global.constants.CIPHER_TYPES.filter((t) => t.isCreate)
  const type = Form.useWatch('type', form) || cipherType.type

  const originItem = useMemo(() => {
    return allCiphers.find((d) => d.id === item?.id)
  }, [allCiphers, item])

  const isUploading = useMemo(() => {
    return !!attachments.find((attach) => !attach.url)
  }, [attachments])

  useEffect(() => {
    setIsUpload(false);
    if (visible) {
      form.resetFields();
      if (originItem?.id) {
        const formData = common.convertCipherToForm(originItem)
        form.setFieldsValue(formData)
        setOriginCipher(originItem);
        setAttachments(originItem?.attachments || []);
      } else {
        const formData = common.convertCipherToForm({
          type: cipherType.type || cipherTypes[0].type,
          folderId: folderId || '',
        })
        form.setFieldsValue(formData)
        setOriginCipher(null);
        setAttachments([]);
      }
    } else {
      setCloneMode(false);
      setCallingAPI(false);
    }
  }, [originItem, visible, cipherType])

  const checkingPolicyItem = (callback = () => {}) => {
    form.validateFields().then((values) => {
      let policyInvalid = false;
      if (type === CipherType.Login) {
        const violations = common.checkPasswordPolicy(values.password);
        if (violations.length > 0) {
          setPolicyItem({ violations });
          setViolatedVisible(true);
          policyInvalid = true;
        }
      }
      if (!policyInvalid) {
        callback()
      }
    })
  }

  const handleCloseFormData = () => {
    setCallingAPI(false);
    setViolatedVisible(false);
    onClose();
  }

  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      if (cloneMode || !originItem?.id) {
        await createCipher(values);
      } else {
        await editCipher(values);
      }
      setPolicyItem({ violations: [] });
      if (isUploading) {
        setIsUpload(true);
      } else {
        handleCloseFormData();
      }
    })
  }

  const createCipher = async (values) => {
    const cipher = common.convertFormToCipher({ ...values, type: type });
    const passwordStrength = values.password ? common.getPasswordStrength(values.password) : {};
    const { data, collectionIds } = await common.getEncCipherForRequest(
      cipher,
      {
        writeableCollections: allCollections.filter((c) => common.isChangeCipher(c)),
        isNewCipher: true,
        cloneMode
      }
    )
    const payload = {
      ...data,
      collectionIds,
      score: passwordStrength.score,
    }
    await cipherServices.create(payload).then(async (response) => {
      setOriginCipher({ ...cipher, id: response.id })
      await createOtp(values);
      global.pushSuccess(t('notification.success.cipher.created'));
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const editCipher = async (values) => {
    const oldValues = common.convertCipherToForm(originItem)
    const cipher = {
      ...common.convertFormToCipher({ ...oldValues, ...values, type: type }),
      id: originItem.id,
      attachments: originItem.attachments,
      passwordHistory: originItem.passwordHistory,
      organizationId: originItem.organizationId
    };
    const passwordStrength = values.password ? common.getPasswordStrength(values.password) : {};
    const { data, collectionIds } = await common.getEncCipherForRequest(
      cipher,
      {
        writeableCollections: allCollections.filter((c) => common.isChangeCipher(c)),
        nonWriteableCollections: allCollections.filter((c) => !common.isChangeCipher(c)),
      }
    )
    const payload = {
      ...data,
      collectionIds,
      score: passwordStrength.score,
    }
    await cipherServices.update(originItem.id, payload).then(async () => {
      setOriginCipher(cipher)
      await createOtp(values);
      global.pushSuccess(t('notification.success.cipher.updated'))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const createOtp = async (values) => {
    if (isCreateOtp && values.totp && !otpLimited) {
      const otp = { notes: values.totp, name: values.name };
      const cipher = common.convertFormToCipher({ ...otp, type: CipherType.TOTP });
      const { data } = await common.getEncCipherForRequest( cipher )
      const payload = { ...data, collectionIds: [] }
      await cipherServices.create(payload)
    }
  }

  return (
    <div className={props.className}>
      <Drawer
        className="vault-form-drawer"
        title={t( `inventory.${cipherType.key}.${originItem && !cloneMode ? 'edit' : 'add'}`)}
        placement="right"
        onClose={onClose}
        open={visible}
        closable={!isTutorial}
        width={600}
        footer={
          <Space className='flex items-center justify-end'>
            <Button
              className="vault-form-close-btn"
              disabled={callingAPI}
              onClick={onClose}
            >
              {t('button.cancel')}
            </Button>
            <Button
              className="vault-form-save-btn"
              type="primary"
              loading={callingAPI}
              onClick={() => checkingPolicyItem(handleSave)}
            >
            { t('button.save') } 
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          labelAlign={'left'}
          className='vault-form'
        >
          <ItemName
            className={'mb-4'}
            item={originItem}
            cipherTypes={cipherTypes}
            cipherType={cipherType}
            disabled={callingAPI}
            isTutorial={isTutorial}
            onChange={(v) => {
              const formData = common.convertCipherToForm({
                type: v,
                folderId: folderId || '',
              })
              form.setFieldsValue(formData)
            }}
          />
          <div className='mb-4'>
            {
              type === CipherType.Login && <PasswordForm
                visible={visible}
                form={form}
                disabled={callingAPI}
              />
            }
            {
              type === CipherType.Card && <CardForm
                form={form}
                disabled={callingAPI}
              />
            }
            {
              type === CipherType.CryptoWallet && <CryptoBackupForm
                form={form}
                disabled={callingAPI}
              />
            }
            {
              type === CipherType.Identity && <IdentityForm
                form={form}
                disabled={callingAPI}
              />
            }
          </div>
          <div>
            {
              type === CipherType.Login && <PasswordOTP
                className={'mb-4'}
                item={originItem}
                form={form}
                visible={visible}
                disabled={callingAPI}
                otpLimited={otpLimited}
                setIsCreateOtp={setIsCreateOtp}
              />
            }            
          </div>
          <Notes
            className={'mb-4'}
            disabled={callingAPI}
          />
          <CustomFields
            className={'mb-4'}
            form={form}
            disabled={callingAPI}
          />
          <div className={'mb-4'}>
            <p className='font-semibold mb-1'>{t('attachments.title')}</p>
            <Attachments
              isUpload={isUpload}
              originCipher={originCipher}
              isUploading={isUploading}
              isCipherForm={true}
              callingAPI={callingAPI}
              attachments={attachments}
              setCallingAPI={setCallingAPI}
              setAttachments={setAttachments}
              uploaded={handleCloseFormData}
            />
          </div>
          <SelectFolder
            form={form}
            disabled={callingAPI}
            item={originItem}
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
      <PasswordViolatedModal
        visible={violatedVisible}
        item={policyItem}
        callingAPI={callingAPI}
        isForm={true}
        onOk={() => handleSave()}
        onClose={() => setViolatedVisible(false)}
      />
    </div>
  );
}

export default FormData;
