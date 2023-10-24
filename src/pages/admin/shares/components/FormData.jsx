import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Form,
  Drawer,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import ShareOption from './form-data/ShareOption';
import ItemsShare from './form-data/ItemsShare';
import FolderShare from './form-data/FolderShare';
import QuickShare from './form-data/QuickShare';
import Footer from './form-data/Footer';

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
  const [step, setStep] = useState(1);
  const [callingAPI, setCallingAPI] = useState(false);

  useEffect(() => {
    if (visible) {
      setStep(1)
      form.setFieldsValue({})
    } else {
      form.resetFields();
      setCallingAPI(false);
    }
  }, [visible, item, menuType])

  return (
    <div className={props.className}>
      <Drawer
        title={t('shares.no_data.add')}
        placement="right"
        width={500}
        closable={step === 1}
        onClose={step === 1 ? onClose : () => {}}
        open={visible}
        footer={<Footer
          form={form}
          step={step}
          setStep={setStep}
          callingAPI={callingAPI}
          onClose={onClose}
          setCallingAPI={setCallingAPI}
        />}
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
                menuType === menuTypes.CIPHERS && <ItemsShare />
              }
              {
                menuType === menuTypes.FOLDERS && <FolderShare />
              }
              {
                menuType === menuTypes.QUICK_SHARES && <QuickShare />
              }
            </div>
          }
        </Form>
      </Drawer>
    </div>
  );
}

export default FormData;
