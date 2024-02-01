import React, { useMemo } from "react";
import {
  Avatar,
  Tooltip
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from "@ant-design/icons";

import common from "../../../../../utils/common";

const SharedWith = (props) => {
  const { t } = useTranslation()
  const myShares = useSelector((state) => state.share.myShares);

  const {
    className = '',
    cipher = {},
    size = ''
  } = props;

  const shareMembers = useMemo(() => {
    const share =
      myShares.find(s => s.id === cipher?.organizationId) || {}
    return share.members || []
  }, [cipher, myShares])

  const sharedWithMembers = useMemo(() => {
    return <Avatar.Group maxCount={3}>
      {
        shareMembers.map((member, index) => <Tooltip key={index} title={member.email}>
          <Avatar
            src={member.avatar}
            size={size}
            style={{
              backgroundColor: common.getColorByIndex(index),
              color: 'black'
            }}
          >
            {member.email.slice(0, 1)?.toUpperCase()}
          </Avatar>
        </Tooltip>)
      }
    </Avatar.Group>
  }, [shareMembers])

  return (
    <div className={className}>
      {sharedWithMembers}
    </div>
  );
}

export default SharedWith;
