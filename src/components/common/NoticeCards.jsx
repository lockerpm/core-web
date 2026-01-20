import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import noticeCardComponents from '../notice-card';

import global from '../../config/global';
import storeActions from '../../store/actions';

function NoticeCards(props) {
  const {
    ConfirmMyShare,
    EmergencyAccessInvitations
  } = noticeCardComponents;

  const { className } = props;

  const myShares = useSelector((state) => state.share.myShares);
  const confirmMyShareVisible = useSelector((state) => state.notice.confirmMyShareVisible);

  const isConfirmMyShare = useMemo(() => {
    return !!myShares.find((s) => {
      return s.members.filter((m) => m.status === global.constants.STATUS.ACCEPTED).length > 0
    })
  }, [myShares])

  useEffect(() => {
    initNoticeCards();
  }, [isConfirmMyShare]);

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
    </div>
  );
}

export default NoticeCards;
