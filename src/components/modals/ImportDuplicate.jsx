import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  Modal,
  Button
} from '@lockerpm/design';

const ImportDuplicateModal = (props) => {
  const { t } = useTranslation();

  const {
    visible = false,
    callingAPI = false,
    importData = [],
    duplicateData = {
      current: [],
      import: [],
      folder: []
    },
    onClose = () => {},
    handlePostImport = () => {}
  } = props;

  const duplicatedCiphers = useMemo(() => {
    return [
      ...duplicateData.current,
      ...duplicateData.import,
    ]
  }, [duplicateData])

  const duplicatedFolders = useMemo(() => {
    return [
      ...duplicateData.folder,
    ]
  }, [duplicateData])

  return (
    <Modal
      className="confirm-password"
      title={t("import_export.duplicate_popup.title")}
      open={visible}
      width={600}
      onCancel={onClose}
      footer={false}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-black-500">
          <span>{t("import_export.duplicate_popup.desc")}</span>
          <ul>
            {
              duplicateData.current.length > 0 && <li>
                <span>{t("import_export.duplicate_popup.desc1", { count: duplicateData.current.length })}</span>
              </li>
            }
            {
              duplicateData.import.length > 0 && <li>
                <span>{t("import_export.duplicate_popup.desc2", { count: duplicateData.import.length })}</span>
              </li>
            }
            {
              duplicateData.folder.length > 0 && <li>
                <span>{t("import_export.duplicate_popup.desc3", { count: duplicateData.folder.length })}</span>
              </li>
            }
          </ul>
        </div>
        <span className="text-black-500">
          {t("import_export.duplicate_popup.question")}
        </span>
        <div className="flex items-center justify-end gap-2">
          <Button
            type="primary"
            ghost
            disabled={callingAPI}
            onClick={() => {
              handlePostImport(importData);
              onClose();
            }}
          >
            {t("import_export.duplicate_popup.not_delete_btn")}
          </Button>
          <Button
            type="primary"
            loading={callingAPI}
            onClick={() => {
              handlePostImport(importData, duplicatedCiphers, duplicatedFolders);
              onClose();
            }}
          >
            {t("import_export.duplicate_popup.delete_btn")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ImportDuplicateModal;