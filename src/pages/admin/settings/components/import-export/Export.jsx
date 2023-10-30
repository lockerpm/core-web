import React, { useState, useMemo, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Select,
  Button,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import ExportConfirmModal from "./ExportConfirm";
import {
} from '../../../../../components'

import global from "../../../../../config/global";

import {
  ExportOutlined
} from "@ant-design/icons";

import { } from '@ant-design/colors';

const Export = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState(null);

  const [form] = Form.useForm();
  const format = Form.useWatch('format', form);

  useEffect(() => {
    form.setFieldsValue({
      format: global.constants.FILE_TYPE.CSV,
      projects: []
    })
  }, [])

  const exportData = useMemo(() => {
    return {
    }
  }, [
    format,
  ])

  const handleExport = () => {
    const fileName = global.jsCore.exportService.getFileName(null, format);
    global.jsCore.platformUtilsService.saveFile(
      window,
      JSON.stringify(exportData, null, '  '),
      { type: 'text/plain' },
      fileName
    )
    global.pushSuccess(t('notification.success.import_export.exported'))
  }

  return (
    <div className={className}>
      
      <Row
        gutter={[16, 16]}
      >
        <Col span={12}>
          <div>
            <p className="font-semibold text-xl">{t('import_export.export')}</p>
            <p className="mt-1">{t('import_export.export_description')}</p>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name={'format'}
              label={
                <p className="font-semibold">{t("import_export.choose_format")}</p>
              }
            >
              <Select
                placeholder={t('placeholder.select')}
                className="w-full"
              >
                {global.constants.EXPORT_FILE_TYPES.map((type) => (
                  <Select.Option
                    value={type.value}
                    key={type.value}
                  >
                    {type.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
          <div className="mt-4 flex justify-end">
            <Button
              type='primary'
              onClick={() => setConfirmVisible(true)}
              icon={<ExportOutlined />}
            >
              {t('button.export')}
            </Button>
          </div>
        </Col>
      </Row>
      <ExportConfirmModal
        visible={confirmVisible}
        onConfirm={() => handleExport()}
        onClose={() => setConfirmVisible(false)}
      />
    </div>
  );
}

export default Export;
