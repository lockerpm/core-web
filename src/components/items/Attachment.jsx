import React, { } from "react";
import { } from 'react-redux';

import {
  Card,
} from '@lockerpm/design';

import {
  FileTextOutlined,
  DownloadOutlined,
  DeleteOutlined
} from "@ant-design/icons";

const Attachment = (props) => {
  const {
    className = '',
    data = null,
  } = props;

  return (
    <Card className={`${className} rounded-xl`} bodyStyle={{ padding: 16 }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2" style={{ width: 'calc(100% - 48px)' }}>
          <div>
            <FileTextOutlined className="text-primary font-bold text-[36px]"/>
          </div>
          <div className="flex flex-col" style={{ width: 'calc(100% - 44px)' }}>
            <p className="font-semibold text-limited text-limited__block text-black-500">Github_Recovery_Code.pdf</p>
            <p className="text-black-500">45 KB</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold cursor-pointer text-black-500">
            <DownloadOutlined className="text-[16px]"/>
          </span>
          <span className="font-semibold cursor-pointer text-danger">
            <DeleteOutlined className="text-[16px]"/>
          </span>
        </div>
      </div>
    </Card>
  );
}

export default Attachment;