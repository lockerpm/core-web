import React, { useEffect, useState } from 'react';
import {
  Form,
  Space,
  Button,
  Drawer,
  Select
} from '@lockerpm/design';
import {
  ItemInput,
} from '../../../../../components'
import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation, Trans } from "react-i18next";
import global from '../../../../../config/global';
import enterpriseMemberServices from '../../../../../services/enterprise-member';

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

  const usernames = Form.useWatch('usernames', form) || [];

  useEffect(() => {
    fetchWsMembers();
  }, [])

  useEffect(() => {
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
    const requests = usernames.map(async (u) => ({
      username: u,
      password: await global.jsCore.passwordGenerationService.generatePassword(options)
    }))
    return await Promise.all(requests)
  }

  const handleSave = async () => {
    form.validateFields().then(async () => {
      setCallingAPI(true);
      const members = await getNewMembers();
      await enterpriseMemberServices.create_members(enterpriseId, {
        members
      }).then(() => {
        onReload();
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
              items={enterpriseMembers.map((m) => m.user.username)}
              disabled={callingAPI}
            />
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
                mail: t('email_setting.title'),
              }}
            />
          </div>
        </Form>
      </Drawer>
    </div>
  );
}

export default FormData;
