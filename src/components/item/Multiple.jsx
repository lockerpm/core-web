import React from "react";
import {
  Space,
  Button,
} from '@lockerpm/design';

import {
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

  const { t } = useTranslation()

  return (
    <Space size={[8, 8]}>
      <p className="text-s">{t('common.selected_items', { amount: selectedRowKeys.length, name: name })}</p>
      {
        isMove && <Button
          size="medium"
          ghost
          type={'primary'}
          loading={callingAPI}
          onClick={() => onMove()}
        >
          {t('inventory.actions.move_to_folder')}
        </Button>
      }
      {
        isRestore && <Button
          size="medium"
          ghost
          type={'primary'}
          loading={callingAPI}
          onClick={() => onRestore(selectedRowKeys)}
        >
          {t('inventory.actions.restore')}
        </Button>
      }
      {
        isDelete && <Button
          size="medium"
          ghost
          type={'primary'}
          loading={callingAPI}
          danger
          onClick={() => onDelete(selectedRowKeys)}
        >
          {t('button.delete')}
        </Button>
      }
      {
        isPermanentlyDelete && <Button
          size="medium"
          ghost
          type={'primary'}
          loading={callingAPI}
          danger
          onClick={() => onPermanentlyDelete(selectedRowKeys)}
        >
          {t('inventory.actions.permanently_deleted')}
        </Button>
      }
      <Button
        size="medium"
        disabled={callingAPI}
        onClick={() => onCancel()}
      >
        {t('button.cancel')}
      </Button>
    </Space>
  );
}

export default MultipleSelect;