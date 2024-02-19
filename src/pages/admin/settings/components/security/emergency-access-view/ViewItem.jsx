import React, { useEffect } from 'react';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Drawer,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import cipherComponents from '../../../../../../components/cipher';

function ViewItem(props) {
  const { DetailList } = cipherComponents;
  const {
    visible = false,
    item = null,
    onClose = () => {},
  } = props
  const { t } = useTranslation()

  useEffect(() => {
  }, [visible])


  return (
    <div className={props.className}>
      <Drawer
        title={t('emergency_access_view.view_item')}
        placement="right"
        width={800}
        onClose={onClose}
        open={visible}
      >
        <DetailList
          cipher={item}
          isPublic={true}
        />
      </Drawer>
    </div>
  );
}

export default ViewItem;
