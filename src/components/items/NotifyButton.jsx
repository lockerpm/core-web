import React from "react";
import {
  Badge,
  Button
} from '@lockerpm/design';

import {
  BellOutlined
} from "@ant-design/icons";

const NotifyButton = (props) => {
  const {
    unreadCount = 0
  } = props;
  return (
    <Badge count={unreadCount}>
      <Button
        shape="circle"
        icon={<BellOutlined />}
      />
    </Badge>
  );
}

export default NotifyButton;