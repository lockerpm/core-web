import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import noticeCardComponents from '../notice-card';
import modalsComponents from '../modals';

import global from '../../config/global';
import storeActions from '../../store/actions';

function NoticeCards(props) {
  const {
    ConfirmMyShare,
    EmergencyAccessInvitations
  } = noticeCardComponents;

  const {
    EncryptionUpdateModal
  } = modalsComponents

  const { className } = props;

  const myShares = useSelector((state) => state.share.myShares);
  const confirmMyShareVisible = useSelector((state) => state.notice.confirmMyShareVisible);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [encryptionUpdateVisible, setEncryptionUpdateVisible] = useState(false);

  const isConfirmMyShare = useMemo(() => {
    return !!myShares.find((s) => {
      return s.members.filter((m) => m.status === global.constants.STATUS.ACCEPTED).length > 0
    })
  }, [myShares])

  const isEncryptionUpdate = useMemo(() => {
    return userInfo.kdf === global.constants.CORE_JS_INFO.KDF && userInfo.kdf_iterations < global.constants.CORE_JS_INFO.KDF_ITERATIONS && userInfo.kdf_version >= 1
  }, [userInfo])

  useEffect(() => {
    initNoticeCards();
  }, [isConfirmMyShare]);

  useEffect(() => {
    if (isEncryptionUpdate) {
      setEncryptionUpdateVisible(true)
    }
  }, [isEncryptionUpdate])

  const initNoticeCards = async () => {
    global.store.dispatch(storeActions.updateConfirmMyShareVisible(isConfirmMyShare))
  }

  return (
    <div className={`notice-cards ${className}`}>
      {
        confirmMyShareVisible && <ConfirmMyShare />
      }
      {
        !confirmMyShareVisible && <EmergencyAccessInvitations />
      }
      {
        isEncryptionUpdate && <EncryptionUpdateModal
          visible={encryptionUpdateVisible}
          onClose={() => setEncryptionUpdateVisible(false)}
        />
      }
    </div>
  );
}

export default NoticeCards;
