import React, { useEffect, useState } from 'react';
import { } from 'react-redux';
import { useTranslation, Trans } from "react-i18next";

import {
  Form,
  Space,
  Button,
  Drawer,
  Select,
  Upload
} from '@lockerpm/design';

import commonComponents from '../../../../../components/common';

import {
  UploadOutlined,
} from '@ant-design/icons';

import coreServices from '../../../../../services/core';
import commonServices from '../../../../../services/common';
import enterpriseMemberServices from '../../../../../services/enterprise-member';

import global from '../../../../../config/global';

const { ItemInput } = commonComponents;

function FormData(props) {
  const {
    visible = false,
    enterpriseId,
    onClose = () => { },
    onReload = () => { },
    onReview = () => { },
  } = props
  const { t } = useTranslation()

  const [form] = Form.useForm();
  const [callingAPI, setCallingAPI] = useState(false);
  const [enterpriseMembers, setEnterpriseMembers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const usernames = Form.useWatch('usernames', form) || [];
  const role = Form.useWatch('role', form);

  useEffect(() => {
    if (visible) {
      fetchWsMembers();
      setSelectedFile(null)
    }
    form.setFieldsValue({
      usernames: [],
      role: global.constants.USER_ROLE.MEMBER
    })
  }, [visible])

  const fetchWsMembers = () => {
    enterpriseMemberServices.list(enterpriseId, { paging: 0 }).then((response) => {
      setEnterpriseMembers(response);
    }).catch(() => {
      setEnterpriseMembers([])
    })
  }

  const getNewMembers = async () => {
    const options = {
      length: 16,
      uppercase: true,
      lowercase: true,
      number: true,
      special: true,
      ambiguous: false
    }
    const requests = usernames.map(async (u) => {
      const password = await global.jsCore.passwordGenerationService.generatePassword(options)
      const makeKey = await coreServices.make_key(u, password)
      const hashedPassword = await global.jsCore.cryptoService.hashPassword(password, makeKey)
      const encKey = await global.jsCore.cryptoService.makeEncKey(makeKey)
      const keys = await global.jsCore.cryptoService.makeKeyPair(encKey[0])
      const passwordStrength = commonServices.password_strength(password);

      return {
        email: u,
        password: password,
        role: role,
        master_password_hash: hashedPassword,
        full_name: '',
        kdf: global.constants.CORE_JS_INFO.KDF,
        kdf_iterations: global.constants.CORE_JS_INFO.KDF_ITERATIONS,
        master_password_hint: '',
        key: encKey[1].encryptedString,
        master_password_score: passwordStrength.score,
        keys: {
          public_key: keys[0],
          encrypted_private_key: keys[1].encryptedString,
        }
      }
    })
    return await Promise.all(requests)
  }

  const handleSave = async () => {
    form.validateFields().then(async () => {
      setCallingAPI(true);
      const members = await getNewMembers();
      await enterpriseMemberServices.create_members(enterpriseId, {
        members
      }).then(() => {
        onReload(true);
        fetchWsMembers();
        onClose();
        onReview(members)
      }).catch((error) => {
        global.pushError(error)
      })
      setCallingAPI(false);
    })
  }

  const handleClose = () => {
    form.resetFields();
    onClose()
  }

  const getFileContents = async (file) => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = evt => {
        resolve(evt.target.result)
      }
      reader.onerror = () => {
        reject(Error('Error'))
      }
    })
  }

  const uploadProps = {
    name: 'file',
    showUploadList: false,
    accept: `.csv`,
    beforeUpload: async (file) => {
      const fileType = file.type;
      const isFormat = fileType.includes('csv');
      if (!isFormat) {
        global.pushError(t('drag_upload.invalid'));
      } else {
        setSelectedFile(file)
        const fileContent = await getFileContents(file);
        const contentFormat = fileContent?.split('\n') || [];
        const emails = contentFormat
          .filter(Boolean).map((d) => d.split(',')[0])
          .filter(e => {
            const isEmail = global.patterns.EMAIL.test(e) && !usernames.includes(e);
            return isEmail
          })
        const newUsernames = [...new Set(emails)]
        if (newUsernames.length === 0) {
          global.pushError(t('drag_upload.invalid'));
        } else {
          form.setFieldValue('usernames', newUsernames )
        }
      }
    },
  };

  return (
    <div className={props.className}>
      <Drawer
        title={t('enterprise_members.form.title')}
        placement="right"
        onClose={handleClose}
        open={visible}
        footer={
          <Space className='flex items-center justify-end'>
            <Button
              disabled={callingAPI}
              onClick={handleClose}
            >
              {t('button.cancel')}
            </Button>
            <Button
              type="primary"
              disabled={!usernames.length}
              loading={callingAPI}
              onClick={handleSave}
            >
              {t('button.create')}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          labelAlign={'left'}
        >
          <Form.Item
            name={'usernames'}
            className='mb-2'
            rules={[
              ({ }) => ({
                validator(_, value) {
                  const existedUsernames = value.filter((v) => enterpriseMembers.find((m) => m.email === v))
                  if (existedUsernames.length <= 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('validation.existed', { name: t('common.email') })));
                },
              })
            ]}
            label={<div>
              <p className='font-bold'>{t('common.email')}</p>
              <span>{t('enterprise_members.form.username_description')}</span>
            </div>}
          >
            <ItemInput
              type={'email'}
              items={enterpriseMembers.map((m) => m.email)}
              disabled={callingAPI}
            />
          </Form.Item>
          <Form.Item
            label={<div>
              <p className='font-bold'>{t('import_export.upload_file')} (CSV)</p>
            </div>}
          >
            <div className='flex items-center'>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>
                  {t('button.choose_file')}
                </Button>
              </Upload>
              {
                !selectedFile && <span className='ml-2'>
                  <i>{t('common.no_file_chosen')}</i>
                </span>
              }
            </div >
          </Form.Item>
          <Form.Item
            name={'role'}
            className='mb-2'
            rules={[
              global.rules.REQUIRED(t('enterprise_members.role'))
            ]}
            label={<div>
              <p className='font-bold'>{t('enterprise_members.role')}</p>
              <span>{t('enterprise_members.form.role_description')}</span>
            </div>}
          >
            <Select
              className='w-full'
              placeholder={t('placeholder.select')}
              options={[
                ...global.constants.USER_ROLES.filter((r) => r.form).map((r) => ({
                  value: r.value,
                  label: t(r.label)
                }))
              ]}
            />
          </Form.Item>
          <div className='mt-4'>
            <Trans
              i18nKey='enterprise_members.form.new_member_invite'
              values={{
                mail: t('email_settings.title'),
              }}
            />
          </div>
        </Form>
      </Drawer>
    </div>
  );
}

export default FormData;
