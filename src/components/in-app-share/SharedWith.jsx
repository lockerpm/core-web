import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Avatar,
  Tooltip,
  Divider
} from '@lockerpm/design';

import {
  GroupOutlined
} from "@ant-design/icons";

import common from "../../utils/common";

const SharedWith = (props) => {
  const { t } = useTranslation()
  const myShares = useSelector((state) => state.share.myShares);

  const {
    className = '',
    justify = 'center',
    cipher = {},
    size = 30
  } = props;

  const shareMembers = useMemo(() => {
    const share =
      myShares.find(s => s.id === cipher?.organizationId) || {}
    return share.members || []
  }, [cipher, myShares])

  const shareGroups = useMemo(() => {
    const share =
      myShares.find(s => s.id === cipher?.organizationId) || {}
    return share.groups || []
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
            {member.email?.slice(0, 1)?.toUpperCase()}
          </Avatar>
        </Tooltip>)
      }
    </Avatar.Group>
  }, [shareMembers])

  const sharedWithGroups = useMemo(() => {
    return <Avatar.Group maxCount={3}>
      {
        shareGroups.map((group, index) => <Tooltip key={index} title={group.name}>
          <GroupOutlined style={{ fontSize: size }}/>
        </Tooltip>)
      }
    </Avatar.Group>
  }, [shareGroups])

  return (
    <div className={`${className} flex items-center justify-${justify}`}>
      {sharedWithMembers}
      {
        shareGroups.length > 0 && <Divider
          type={"vertical"}
          style={{
            height: size
          }}
        />
      }
      {sharedWithGroups}
    </div>
  );
}

export default SharedWith;
