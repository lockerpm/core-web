import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Drawer,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import ListItemDetails from '../../../../vault/components/detail/List';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";


function ViewItem(props) {
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
        <ListItemDetails
          cipher={item}
          isPublic={true}
        />
      </Drawer>
    </div>
  );
}

export default ViewItem;
