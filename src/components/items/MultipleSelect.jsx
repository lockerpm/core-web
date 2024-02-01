import React from "react";
import {
  Space,
  Button,
} from '@lockerpm/design';

import {
  FolderOutlined,
  UndoOutlined,
  DeleteOutlined,
  ClearOutlined,
  CloseOutlined
} from "@ant-design/icons";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

const MultipleSelect = (props) => {
  const {
    name = '',
    selectedRowKeys = [],
    callingAPI = false,
    isMove = false,
    isRestore = false,
    isDelete = false,
    isPermanentlyDelete = false,
    onMove = () => {},
    onDelete = () => { },
    onPermanentlyDelete = () => {},
    onRestore = () => {},
    onCancel = () => { },
  } = props;

  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.system.isMobile)

  return (
    <Space size={[8, 8]} className="mt-2">
      <p className="text-s">{t('common.selected_items', { amount: selectedRowKeys.length, name: name })}</p>
      {
        isMove && <Button
          size="medium"
          ghost
          type={'primary'}
          loading={callingAPI}
          icon={<FolderOutlined />}
          onClick={() => onMove()}
        >
          {isMobile ? '' : t('inventory.actions.move_to_folder')}
        </Button>
      }
      {
        isRestore && <Button
          size="medium"
          ghost
          type={'primary'}
          loading={callingAPI}
          icon={<UndoOutlined />}
          onClick={() => onRestore(selectedRowKeys)}
        >
          {isMobile ? '' : t('inventory.actions.restore')}
        </Button>
      }
      {
        isDelete && <Button
          size="medium"
          ghost
          type={'primary'}
          loading={callingAPI}
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(selectedRowKeys)}
        >
          {isMobile ? '' : t('button.delete')}
        </Button>
      }
      {
        isPermanentlyDelete && <Button
          size="medium"
          ghost
          type={'primary'}
          loading={callingAPI}
          danger
          icon={<ClearOutlined />}
          onClick={() => onPermanentlyDelete(selectedRowKeys)}
        >
          {isMobile ? '' : t('inventory.actions.permanently_deleted')}
        </Button>
      }
      <Button
        size="medium"
        disabled={callingAPI}
        icon={<CloseOutlined />}
        onClick={() => onCancel()}
      >
        {isMobile ? '' : t('button.cancel')}
      </Button>
    </Space>
  );
}

export default MultipleSelect;