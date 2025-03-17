import React, { useEffect, useState, useMemo } from 'react';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Form,
  Space,
  Button,
  Drawer,
  Upload,
  message,
  Select,
  Input,
} from '@lockerpm/design';

import {
  UploadOutlined,
  LinkOutlined
} from '@ant-design/icons';

import importServices from '../../services/import';
import commonServices from '../../services/common';

import { FolderRequest } from '../../core-js/src/models/request';
import { KvpRequest } from '../../core-js/src/models/request/kvpRequest';
import { ImportCiphersRequest } from '../../core-js/src/models/request/importCiphersRequest';

import global from '../../config/global';
import common from '../../utils/common';

function ImportForm(props) {
  const {
    visible = false,
    isTutorial = false,
    onClose = () => {},
  } = props
  const { t } = useTranslation();

  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const format = Form.useWatch('format', form);
  const fileContent = Form.useWatch('fileContent', form);

  const featuredImportOptions = global.jsCore.importService.featuredImportOptions || []
  const regularImportOptions = (global.jsCore.importService.regularImportOptions || []).sort((a, b) => {
    if (a.name == null && b.name != null) {
      return -1
    }
    if (a.name != null && b.name == null) {
      return 1
    }
    if (a.name == null && b.name == null) {
      return 0
    }

    return a.name.localeCompare(b.name)
  })

  useEffect(() => {
    setSelectedFile(null);
    form.setFieldsValue({
      format: featuredImportOptions[0].id,
      fileContent: null
    })
  }, [visible])

  const acceptFileType = useMemo(() => {
    const option = [...featuredImportOptions, ...regularImportOptions].find((o) => o.id == format);
    return option?.name?.split('(')[1]?.split(')')[0] || '*'
  }, [format])

  const uploadProps = {
    name: 'file',
    showUploadList: false,
    accept: `.${acceptFileType}`,
    beforeUpload: async (file) => {
      const fileType = file.type;
      const isFormat = fileType.includes(acceptFileType);
      if (!isFormat) {
        message.error(t('drag_upload.invalid', {type: acceptFileType}));
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
        if (format === 'lastpasscsv' && file.type === 'text/html') {
          const parser = new DOMParser()
          const doc = parser.parseFromString(evt.target.result, 'text/html')
          const pre = doc.querySelector('pre')
          if (pre != null) {
            resolve(pre.textContent)
            return
          }
          reject(Error(''))
          return
        }
        resolve(evt.target.result)
      }
      reader.onerror = () => {
        reject(Error(''))
      }
    })
  }

  const handleImport = async () => {
    setCallingAPI(true);
    try {
      const importer = global.jsCore.importService.getImporter(format, null)
      let content = fileContent;
      if (selectedFile) {
        try {
          const fContent = await getFileContents(selectedFile)
          if (fContent) {
            content = fContent
          }
        } catch {}
      }
      if (!content) {
        global.pushError({ message: t('import_export.select_appropriate_file') })
      } else {
        const importResult = await importer.parse(content);
        if (importResult.success) {
          if (importResult.folders.length === 0 && importResult.ciphers.length === 0) {
            global.pushError({ message: t('import_export.no_data') })
            return
          }
          if (importResult.ciphers.length > 0) {
            const halfway = Math.floor(importResult.ciphers.length / 2)
            const last = importResult.ciphers.length - 1
            if (
              common.badData(importResult.ciphers[0]) &&
              common.badData(importResult.ciphers[halfway]) &&
              common.badData(importResult.ciphers[last])
            ) {
              global.pushError({ message: t('import_export.incorrect_format') })
              return
            }
          }
          try {
            const importResponse = await postImport(importResult)
            global.pushSuccess(
              t('import_export.import_success', {
                foldersCount: importResponse.foldersCount,
                ciphersCount: importResponse.ciphersCount,
                total: importResponse.totalCipherImport
              })
            )
            await commonServices.sync_data();
            onClose();
          } catch (error) {
            global.pushError(error)
          }
        } else {
          global.pushError({ message: t('import_export.incorrect_format') })
        }
      }
    } catch (error) {
      global.pushError({ message: t('drag_upload.content_invalid') })
    }
    setCallingAPI(false);
  }

  const postImport = async (importResult) => {
    let request = new ImportCiphersRequest()
    for (let i = 0; i < importResult.ciphers.length; i++) {
      const { data } = await common.getEncCipherForRequest(
        importResult.ciphers[i],
        {
          noCheck: true
        }
      )
      request.ciphers.push(data)
    }
    if (importResult.folders != null) {
      for (let i = 0; i < importResult.folders.length; i++) {
        const f = await global.jsCore.folderService.encrypt(importResult.folders[i])
        request.folders.push(new FolderRequest(f))
      }
    }
    if (importResult.folderRelationships != null) {
      importResult.folderRelationships.forEach(r =>
        request.folderRelationships.push(new KvpRequest(r[0], r[1]))
      )
    }
    const folderRelationships = request.folderRelationships
    let folderImportResults = []
    let importedFolders = 0
    while (importedFolders < request.folders.length) {
      const folders = request.folders.slice(
        importedFolders,
        importedFolders + 1000
      )
      const importResult = await importServices.import_folders({ folders })
      folderImportResults = folderImportResults.concat(importResult.ids || [])
      importedFolders += 1000
    }
    request.ciphers = request.ciphers.map((cipher, index) => {
      const folderRelationship = folderRelationships.find(
        item => item.key === index
      )
      return {
        ...cipher,
        folderId: folderRelationship
          ? folderImportResults[folderRelationship.value]
          : null
      }
    })
    let importedCiphers = 0
    while (importedCiphers < request.ciphers.length) {
      const ciphers = request.ciphers.slice(
        importedCiphers,
        importedCiphers + 1000
      )
      await importServices.import_ciphers({ ciphers })
      importedCiphers += 1000
    }
    return {
      ciphersCount: request.ciphers.length,
      foldersCount: request.folders.length,
      totalCipherImport: request.ciphers.length
    }
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
        width={600}
        closable={!isTutorial}
        className='import-form-drawer'
        footer={
          <Space className='flex items-center justify-end'>
            <Button
              className="import-form-close-btn"
              onClick={handleClose}
            >
              {t('button.cancel')}
            </Button>
            <Button
              type="primary"
              className="import-form-import-btn"
              loading={callingAPI}
              disabled={!selectedFile && !fileContent}
              onClick={handleImport}
            >
              { t('button.import') } 
            </Button>
          </Space>
        }
      >
       <Form
          form={form}
          layout="vertical"
          labelAlign={'left'}
          className='import-form'
        >
          <Form.Item
            name={'format'}
            className='mb-2'
            label={<div>
              <p className='font-semibold'>{t('import_export.choose_format')}</p>
            </div>}
            rules={[]}
          >
            <Select
              placeholder={t('placeholder.select')}
              className="w-full"
              popupClassName='import-format-options'
              showSearch={true}
              filterOption
              defaultOpen={isTutorial}
              options={[
                {
                  label: t('import_export.popular'),
                  options: featuredImportOptions.map((o) => ({ value: o.id, label: o.name, className: `import-format-option-${o.id}` })),
                },
                {
                  label: t('import_export.others'),
                  options: regularImportOptions.map((o) => ({ value: o.id, label: o.name, className: `import-format-option-${o.id}` })),
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            className='mb-0 mt-4'
            label={<div>
              <p className='font-semibold'>{t('import_export.upload_file')}</p>
            </div>}
          >
            <div className='flex items-center'>
              <Upload {...uploadProps}>
                <Button
                  icon={<UploadOutlined />}
                  className="import-choose-file"
                >
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
          <Form.Item
            name={'fileContent'}
            className='mt-4'
            label={<div>
              <p className='font-semibold'>
                {t('import_export.copy_paste_file_contents')}
              </p>
            </div>}
          >
            <Input.TextArea
              rows={8}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default ImportForm;
