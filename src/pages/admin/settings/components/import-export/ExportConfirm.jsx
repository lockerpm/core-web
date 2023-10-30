import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input
} from '@lockerpm/design';

import {
  InfoCircleFilled
} from "@ant-design/icons";

import { } from 'react-redux';

import { useTranslation } from "react-i18next";

import { orange } from '@ant-design/colors';
import global from "../../../../../config/global";
import authServices from "../../../../../services/auth";

const ExportConfirmModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    isImport = false,
    onConfirm = () => {},
    onClose = () => {},
  } = props;
  const [form] = Form.useForm();
  const [callingAPI, setCallingAPI] = useState(false);

  const password = Form.useWatch('password', form);

  useEffect(() => {
    form.resetFields()
  }, [visible])

  const handleExport = async () => {
    form.validateFields().then(async () => {
      setCallingAPI(true)
      const keyHash = await global.jsCore.cryptoService.hashPassword(password, null)
      const storedKeyHash = await global.jsCore.cryptoService.getKeyHash()
      if (!!storedKeyHash && !!keyHash && storedKeyHash == keyHash) {
        onConfirm();
        onClose();
      } else {
        authServices.logout();
      }
      setCallingAPI(false);
    })
  }

  return (
    <Modal
      title={
        <div className="flex items-center">
          <InfoCircleFilled style={{
            color: orange[5]
          }}/>
          <p className="ml-2">
            {t('import_export.confirm', { type: isImport ? t('import_export.import') : t('import_export.export') })}
          </p>
        </div>
      }
      open={visible}
      width={360}
      okText={t('button.export')}
      onOk={() => handleExport()}
      onCancel={() => onClose()}
      okButtonProps={{
        loading: callingAPI,
        disabled: !password
      }}
      cancelButtonProps={{
        disabled: callingAPI
      }}
    >
      <p className="mb-2">
        {t('import_export.confirm_note')}
      </p>
      <Form
        form={form}
        onFinish={handleExport}
      >
        <Form.Item
          name={'password'}
          rules={[
            global.rules.REQUIRED(t('auth_pages.password')),
          ]}
        >
          <Input.Password
            autoFocus={true}
            placeholder={t('placeholder.enter')}
            disabled={callingAPI}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ExportConfirmModal;