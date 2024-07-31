import React, { useState, useEffect } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Row,
  Col,
  Form,
  Select,
  Button,
} from '@lockerpm/design';

import {
  ExportOutlined,
} from "@ant-design/icons";

import modalsComponents from "../../../../../components/modals";

import { Utils } from "../../../../../core-js/src/misc/utils";
import { FolderView } from "../../../../../core-js/src/models/view/folderView";
import { FolderWithId as FolderExport } from '../../../../../core-js/src/models/export/folderWithId'
import { CipherWithIds as CipherExport } from '../../../../../core-js/src/models/export/cipherWithIds'

import global from "../../../../../config/global";
import common from "../../../../../utils/common";

import * as papa from 'papaparse';

const Export = (props) => {
  const { t } = useTranslation();
  const { PasswordConfirmModal } = modalsComponents;
  const {
    className = '',
  } = props;
  const [callingAPI, setCallingAPI] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [form] = Form.useForm();
  const format = Form.useWatch('format', form);

  useEffect(() => {
    form.setFieldsValue({
      format: global.constants.FILE_TYPE.CSV,
    })
  }, [])

  // Decrypted export
  const getDecryptedExport = async (format) => {
    let folders = []
    let ciphers = []

    folders = [...(await global.jsCore.folderService.getAllDecrypted())]
    ciphers = [...(await global.jsCore.cipherService.getAllDecrypted())]

    // Convert collections to folders
    const collections = await global.jsCore.collectionService.getAllDecrypted()
    collections.forEach(c => {
      const f = new FolderView()
      f.name = c.name
      f.id = `collection_${c.id}`
      folders.push(f)
    })
    ciphers.forEach(c => {
      if (!c.organizationId) {
        return
      }
      c.folderId = c.collectionIds.length
        ? `collection_${c.collectionIds[0]}`
        : c.folderId
      c.organizationId = null
      c.collectionIds = null
    })

    // Don't export protected or deleted cipher
    ciphers = ciphers.filter(
      cipher => !common.isProtectedCipher(cipher) && cipher.deletedDate === null
    )

    // CSV export
    if (format === global.constants.FILE_TYPE.CSV) {
      const foldersMap = new Map()
      folders.forEach(f => {
        if (f.id != null) {
          foldersMap.set(f.id, f)
        }
      })

      const exportCiphers = []
      ciphers.forEach(c => {
        const cipher = {}
        cipher.folder =
          c.folderId != null && foldersMap.has(c.folderId)
            ? foldersMap.get(c.folderId).name
            : null
        cipher.favorite = c.favorite ? 1 : null
        common.buildCommonCipher(cipher, c)
        exportCiphers.push(cipher)
      })

      return papa.unparse(exportCiphers)
    }

    // JSON
    if (format === global.constants.FILE_TYPE.JSON) {
      const jsonDoc = {
        encrypted: false,
        folders: [],
        items: []
      }

      folders.forEach(f => {
        if (f.id == null) {
          return
        }
        const folder = new FolderExport()
        folder.build(f)
        jsonDoc.folders.push(folder)
      })

      ciphers.forEach(c => {
        const cipher = new CipherExport()
        cipher.build(c)
        cipher.collectionIds = null
        jsonDoc.items.push(cipher)
      })

      return JSON.stringify(jsonDoc, null, '  ')
    }
  }

  // Encrypted export
  const getEncryptedExport = async () => {
    let folders = []
    let ciphers = []

    folders = [...(await global.jsCore.folderService.getAll())]
    ciphers = [...(await global.jsCore.cipherService.getAll())]

    // Don't export protected or deleted cipher
    ciphers = ciphers.filter(
      cipher => !common.isProtectedCipher(cipher) && cipher.deletedDate === null
    )

    // Create key validation
    const encKeyValidation = await global.jsCore.cryptoService.encrypt(
      Utils.newGuid()
    )
    const jsonDoc = {
      encrypted: true,
      encKeyValidation_DO_NOT_EDIT: encKeyValidation.encryptedString,
      folders: [],
      items: []
    }

    // Encrypt shared cipher with personal key
    const newCiphers = []
    let promises = []
    const _encryptCipherWithPersonalKey = async c => {
      const decCipher = await global.jsCore.cipherService.getSingleDecrypted(c.id)
      decCipher.folderId = c.collectionIds.length
        ? `collection_${c.collectionIds[0]}`
        : c.folderId
      decCipher.organizationId = null
      decCipher.collectionIds = null
      const cipher = await global.jsCore.cipherService.encrypt(decCipher)
      newCiphers.push(cipher)
    }
    ciphers.forEach(c => {
      if (!c.organizationId) {
        newCiphers.push(c)
        return
      }
      promises.push(_encryptCipherWithPersonalKey(c))
    })
    await Promise.all(promises)
    ciphers = [...newCiphers]

    // Convert collections to folders
    promises = []
    const collections = await global.jsCore.collectionService.getAllDecrypted()
    collections.forEach(c => {
      const f = new FolderView()
      f.name = c.name
      f.id = `collection_${c.id}`
      promises.push(
        global.jsCore.folderService.encrypt(f).then(encryptedFolder => {
          folders.push(encryptedFolder)
        })
      )
    })
    await Promise.all(promises)

    // Build export data
    folders.forEach(f => {
      if (f.id == null) {
        return
      }
      const folder = new FolderExport()
      folder.build(f)
      jsonDoc.folders.push(folder)
    })
    ciphers.forEach(c => {
      if (c.organizationId != null) {
        return
      }
      const cipher = new CipherExport()
      cipher.build(c)
      cipher.collectionIds = null
      jsonDoc.items.push(cipher)
    })

    return JSON.stringify(jsonDoc, null, '  ')
  }

  const getExportData = async () => {
    if (format === global.constants.FILE_TYPE.ENCRYPTED_JSON) {
      return getEncryptedExport()
    } else {
      return getDecryptedExport(format)
    }
  }

  const createFileName = () => {
    let prefix = null;
    if (format === global.constants.FILE_TYPE.ENCRYPTED_JSON) {
      prefix = 'encrypted'
    }
    return global.jsCore.exportService.getFileName(prefix, format);
  }

  const handleExport = async () => {
    setCallingAPI(true);
    const fileName = createFileName();
    const exportData = await getExportData()
    global.jsCore.platformUtilsService.saveFile(
      window,
      exportData,
      { type: 'text/plain' },
      fileName
    )
    global.pushSuccess(t('notification.success.import_export.exported'));
    setConfirmVisible(false);
    setCallingAPI(false);
  }

  return (
    <div className={className}>
      
      <Row
        gutter={[16, 16]}
      >
        <Col span={12} md={12} sm={24} xs={24}>
          <div>
            <p className="font-semibold text-xl">{t('import_export.export')}</p>
            <p className="mt-1">{t('import_export.export_description')}</p>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form
            form={form}
            layout="vertical"
            disabled={callingAPI}
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
              ghost
              icon={<ExportOutlined />}
              loading={callingAPI}
              onClick={() => setConfirmVisible(true)}
            >
              {t('button.export')}
            </Button>
          </div>
        </Col>
      </Row>
      <PasswordConfirmModal
        visible={confirmVisible}
        title={t('import_export.confirm', { type: t('import_export.export') })}
        okText={t('button.export')}
        onConfirm={() => handleExport()}
        onClose={() => setConfirmVisible(false)}
      />
    </div>
  );
}

export default Export;
