import React, { useEffect, useState } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
  Form,
  Input,
  Alert,
  Card,
  Row,
  Col,
  Image
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../../../components/items";
import commonComponents from "../../../components/common";

import toolServices from "../../../services/tool";

import global from "../../../config/global";
import common from "../../../utils/common";

const { ImageIcon } = itemsComponents;
const { PageHeader } = commonComponents;

const BreachScanner = (props) => {
  const {} = props;
  const { t } = useTranslation();
  const [callingAPI, setCallingAPI] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isError, setIsError] = useState(false);
  const [breachResult, setBreachResult] = useState([]);

  const [form] = Form.useForm();

  const username = Form.useWatch('username', form)

  useEffect(() => {
    setCallingAPI(false);
    setIsError(false);
    setIsChecked(false);
    form.resetFields()
  }, [])

  const handleCheckBreaches = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      await toolServices.breach({ email: values.username }).then((response) => {
        setBreachResult(response);
        setIsError(false);
        setIsChecked(true);
      }).catch((error) => {
        setCallingAPI([])
        setIsError(true)
        setIsChecked(true);
        global.pushError(error)
      })
      setCallingAPI(false);
    })
  }

  return (
    <div className="breach-scanner layout-content">
      <PageHeader
        title={t('security_tools.data_breach_scanner.title')}
        subtitle={t('security_tools.data_breach_scanner.description')}
        actions={[]}
        Logo={() => <ImageIcon
          name="security-tools/pw-breach"
          className="mr-4"
          width={48}
          height={48}
        />}
      />
      <Card
        className="mt-4"
        bodyStyle={{ padding: 12 }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: t('security_tools.data_breach_scanner.content_title') }}
        />
        <Form
          form={form}
          layout="vertical"
          labelAlign={'left'}
        >
          <Form.Item
            name={'username'}
            className='my-2'
            label={<div>
              <p className='font-semibold'>{t('security_tools.data_breach_scanner.input_label')}</p>
            </div>}
            rules={[
              global.rules.REQUIRED(t('common.username_or_email'))
            ]}
          >
            <Input
              style={{ width: 400 }}
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
              onChange={() => setIsChecked(false)}
            />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          className="mt-3"
          loading={callingAPI}
          onClick={handleCheckBreaches}
        >
          { t('security_tools.data_breach_scanner.action') } 
        </Button>
      </Card>
      {
        isChecked && !isError && !breachResult?.length && <Alert
          className="mt-4"
          style={{ padding: 12 }}
          message={
            <p
              className="font-semibold text-primary"
            >
              {t('security_tools.data_breach_scanner.action').toUpperCase()}
            </p>
          }
          description={t('security_tools.data_breach_scanner.breach_not_found_details', { username: username })}
          type="success"
        />
      }
      {
        isChecked && <div className="mt-4">
          {
            breachResult.map((b) => <Card
              className="mb-2"
              bodyStyle={{ padding: 12 }}
            >
              <Row gutter={[24, 24]}>
                <Col span={4}>
                  <Image src={b.logo_path} alt="" />
                </Col>
                <Col span={14}>
                  <p className="font-semibold mb-2">
                    { b.name }
                  </p>
                  <div
                    className="mb-2"
                    dangerouslySetInnerHTML={{ __html: b.description }}
                  />
                  <div className="setting-description">
                    <p className="font-semibold">
                      { t('security_tools.data_breach_scanner.compromised_data') }:
                    </p>
                    <ul className="list-disc list-inside">
                      {
                        b.data_classes.map((d, index) => <li key={index}>
                          {d}
                        </li>)
                      }
                    </ul>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="mb-2">
                    <p className="font-semibold">
                      {t('security_tools.data_breach_scanner.website')}
                    </p>
                    <p>{b.domain}</p>
                  </div>
                  <div className="mb-2">
                    <p className="font-semibold">
                      {t('security_tools.data_breach_scanner.affected_users')}
                    </p>
                    <p>{common.separatorNumber(b.pwn_count)}</p>
                  </div>
                  <div className="mb-2">
                    <p className="font-semibold">
                      {t('security_tools.data_breach_scanner.breach_occurred')}
                    </p>
                    <p>{common.convertDateTime(b.breach_date, 'DD MMMM, YYYY hh:mm A')}</p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {t('security_tools.data_breach_scanner.added_occurred')}
                    </p>
                    <p>{common.convertDateTime(b.added_date, 'DD MMMM, YYYY hh:mm A')}</p>
                  </div>
                </Col>
              </Row>
            </Card>)
          }
        </div>
      }
      
    </div>
  );
}

export default BreachScanner;
