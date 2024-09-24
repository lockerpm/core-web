import React, { } from "react";
import { useSelector } from 'react-redux';

import {
  Avatar,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

const UserInfo = (props) => {
  const {
    isEmail = false
  } = props;

  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <div
      className="flex items-center py-2 px-4 rounded-full"
      style={{ backgroundColor: 'var(--sidebar-menu-active-background-color)', width: 'max-content' }}
    >
      <Avatar src={userInfo?.avatar} >
        {(userInfo?.email || userInfo?.full_name)?.slice(0, 1)?.toUpperCase()}
      </Avatar>
      <p className="ml-2">{isEmail ? userInfo?.email : userInfo?.full_name || userInfo?.email}</p>
    </div>
  );
}

export default UserInfo;
