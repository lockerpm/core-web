import React, { useEffect, useState, useRef } from 'react';
import {
  Form,
  Space,
  Button,
  Drawer,
  Upload,
  message,
  Select,
} from '@lockerpm/design';
import {
  UploadOutlined,
  LinkOutlined
} from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import global from '../../../../../config/global';
import storeActions from '../../../../../store/actions';
import ReactJson from 'react-json-view';

import { CipherType } from '../../../../../core-js/src/enums';
import { CipherData } from '../../../../../core-js/src/models/data/cipherData'

function ImportForm(props) {
  const {
    visible = false,
    onClose = () => {},
  } = props
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);
  const [selectedFile, setSelectedFile] = useState(false);
  const [importData, setImportData] = useState(null);

  const format = Form.useWatch('format', form)

  useEffect(() => {
    setSelectedFile(null);
    setImportData(null);
    form.setFieldsValue({
      format: global.constants.FILE_TYPE.JSON,
    })
  }, [visible])

  const uploadProps = {
    name: 'file',
    showUploadList: false,
    accept: `.${format}`,
    beforeUpload: async (file) => {
      const fileType = file.type;
      const isFormat = fileType.includes(format);

      if (!isFormat) {
        message.error(t('drag_upload.invalid'));
      } else {
        setSelectedFile(file)
      }
    },
  };

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

  const handleReadFile = async () => {
    try {
      const fileContent = await getFileContents(selectedFile);
      setImportData(JSON.parse(fileContent))
    } catch (error) {
      global.pushError({ message: t('drag_upload.content_invalid') })
    }
  }

  const handleImport = async () => {
    setCallingAPI(true);
    setCallingAPI(false);
  }

  const handleClose = () => {
    form.resetFields();
    onClose()
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t('import_export.import')}
        placement="right"
        onClose={handleClose}
        open={visible}
        footer={
          <Space className='flex items-center justify-end'>
            {
              !importData && <Button
                onClick={handleClose}
              >
                {t('button.cancel')}
              </Button>
            }
            {
              !importData && <Button
                type="primary"
                disabled={!selectedFile}
                onClick={handleReadFile}
              >
                { t('button.next') } 
              </Button>
            }
            {
              importData && <Button
                disabled={callingAPI}
                onClick={() => setImportData(null)}
              >
                {t('button.back')}
              </Button>
            }
            {
              importData && <Button
                type="primary"
                loading={callingAPI}
                onClick={handleImport}
              >
                { t('button.import') } 
              </Button>
            }
          </Space>
        }
      >
        {
          !importData && <Form
            form={form}
            layout="vertical"
            labelAlign={'left'}
          >
            <Form.Item
              name={'format'}
              label={<div>
                <p className='font-bold'>{t('import_export.choose_format')}</p>
              </div>}
              rules={[]}
            >
              <Select
                placeholder={t('placeholder.select')}
                className="w-full"
              >
                {global.constants.IMPORT_FILE_TYPES.map((type) => (
                  <Select.Option
                    value={type.value}
                    key={type.value}
                  >
                    {type.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              className='mb-0'
              label={<div>
                <p className='font-bold'>{t('import_export.upload_file')}</p>
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
            {
              selectedFile && <div className='mt-2 flex items-center'>
                <LinkOutlined />
                <p className='ml-2 text-limited text-primary'>{selectedFile?.name}</p>
              </div>
            }
          </Form>
        }
        {
          importData && <div>
            <p className='font-bold mb-2'>{t('import_export.file_content')}</p>
            <ReactJson
              src={importData}
              enableClipboard={false}
              displayDataTypes={false}
              displayObjectSize={false}
              quotesOnKeys={false}
              indentWidth={2}
              onEdit={(v) => setImportData(v.updated_src)}
            />
          </div>
        }
      </Drawer>
    </div>
  );
}

export default ImportForm;
