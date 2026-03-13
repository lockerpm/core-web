import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import JSZip from "jszip";

import {
  Form,
  Space,
  Button,
  Drawer,
  Upload,
  Select,
  Input,
} from '@lockerpm/design';

import {
  UploadOutlined,
  LinkOutlined
} from '@ant-design/icons';

import modalsComponents from '../modals';

import importServices from '../../services/import';
import commonServices from '../../services/common';

import { FolderRequest } from '../../core-js/src/models/request';
import { KvpRequest } from '../../core-js/src/models/request/kvpRequest';
import { ImportCiphersRequest } from '../../core-js/src/models/request/importCiphersRequest';
import { CipherType } from '../../core-js/src/enums';

import global from '../../config/global';
import common from '../../utils/common';

function ImportForm(props) {
  const { ImportDuplicateModal } = modalsComponents;
  const {
    visible = false,
    isTutorial = false,
    onClose = () => {},
  } = props
  const { t } = useTranslation();

  const allCiphers = useSelector((state) => state.cipher.allCiphers);
  const allFolders = useSelector((state) => state.folder.allFolders);
  const allCollections = useSelector((state) => state.collection.allCollections);

  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);
  const [importData, setImportData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [duplicateVisible, setDuplicateVisible] = useState(false);
  const [duplicateData, setDuplicateData] = useState({
    current: [],
    import: [],
    folder: []
  });

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
    setCallingAPI(false);
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
      setSelectedFile(file)
    },
  };

  const getFileContents = async (file) => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = async evt => {
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
        if (format === '1password1pux') {
          const zip = new JSZip()
          try {
            const contents = await zip.loadAsync(file)
            if (!contents.files['export.data']) {
              reject(Error(''))
              return
            }
            const fileData = await contents.files['export.data'].async('string')
            resolve(fileData)
            return
          } catch (error) {
            reject(Error(''))
            return
          }
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
            importResult.ciphers = importResult.ciphers.map((c, index) => ({ ...c, id: index }))
            await checkingDuplicate(importResult)
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

  const checkingDuplicate = async (importResult) => {
    const currentCiphers = allCiphers
      .filter((c) => !c.isDeleted && c.type !== CipherType.MasterPassword)
      .map((c) => ({ id: c.id, data: common.convertCipherToImportForm(c)}));
    const importCiphers = importResult.ciphers
      .map((c) => common.parseNotesOfNewTypes(c))
      .map((c) => ({ id: c.id, data: common.convertCipherToImportForm(c)}));
    const currentFolders = [...allFolders, ...allCollections]
      .map((f) => ({ id: f.id, name: f.name }))
    const importFolders = importResult.folders
      .map((f, index) => ({ id: index, name: f.name }))

    const currentCipherStrings = currentCiphers.map((c) => JSON.stringify(c.data));
    const currentFolderNames = currentFolders.map((c) => c.name);

    const currentDuplicateCiphers = importCiphers
      .filter((c) => currentCipherStrings.includes(JSON.stringify(c.data)))
      .map((c) => ({ id: c.id, ...c.data }));

    const importDuplicateCiphers = common.getDuplicateObjects(importCiphers.map((c) => c.data));
    const importDuplicateFolders = importFolders.filter((f) => {
      const folderRelationships = importResult.folderRelationships.filter((r) => r[1] == f.id && !currentDuplicateCiphers.map((c) => c.id).includes(r[0]));
      return currentFolderNames.includes(f.name) && folderRelationships.length === 0
    })

    const result = currentDuplicateCiphers.length > 0 || importDuplicateCiphers.length > 0;
    if (result) {
      setImportData(importResult);
      setDuplicateData({
        current: currentDuplicateCiphers,
        import: importDuplicateCiphers,
        folder: importDuplicateFolders
      })
      setDuplicateVisible(true)
    } else {
      setImportData(null);
      await handlePostImport(importResult)
    }
  }

  const handlePostImport = async (importResult, duplicatedCiphers = [], duplicateFolders = []) => {
    try {
      const importResponse = await postImport(importResult, duplicatedCiphers, duplicateFolders)
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
  }

  const postImport = async (importResult, duplicatedCiphers = [], duplicateFolders = []) => {
    const duplicatedCipherIds = duplicatedCiphers.map((c) => c.id);
    const duplicatedFolderIds = duplicateFolders.map((c) => c.id);
    const requestFolders = [];

    let request = new ImportCiphersRequest();
    for (let i = 0; i < importResult.ciphers.length; i++) {
      if (!duplicatedCipherIds.includes(i)) {
        const { data } = await common.getEncCipherForRequest(
          importResult.ciphers[i],
          {
            noCheck: true
          }
        )
        request.ciphers.push(data)
      }
    }
    if (importResult.folders != null) {
      for (let i = 0; i < importResult.folders.length; i++) {
        if (!duplicatedFolderIds.includes(i)) {
          const f = await global.jsCore.folderService.encrypt(importResult.folders[i])
          request.folders.push(new FolderRequest(f))
          requestFolders.push({ ...importResult.folders[i], id: i })
        }
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
      const importFolderRes = await importServices.import_folders({ folders })
      folderImportResults = folderImportResults.concat(importFolderRes.ids || [])
      importedFolders += 1000
    }
    request.ciphers = request.ciphers.map((cipher) => {
      const folderRelationship = folderRelationships.find(item => item.key === cipher.id);
      const requestFoldersIndex = requestFolders.findIndex((f) => f.id == folderRelationship?.value)
      delete cipher.id
      return {
        ...cipher,
        folderId: folderRelationship
          ? folderImportResults[requestFoldersIndex]
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
      totalCipherImport: importResult.ciphers.length
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
              autoSize={{ minRows: 4 }}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
        </Form>
      </Drawer>
      <ImportDuplicateModal
        visible={duplicateVisible}
        duplicateData={duplicateData}
        importData={importData}
        handlePostImport={handlePostImport}
        onClose={() => setDuplicateVisible(false)}
      />
    </div>
  );
}

export default ImportForm;
