import React, {  } from "react";

import {
  Card
} from '@lockerpm/design';

import commonComponents from "../../../components/common";

import images from "../../../assets/images";

const AuthCard = (props) => {
  const { AuthLogo } = commonComponents;
  const { AuthBgImage } = images;

  const {
    className,
    paddingTop = 62,
    bordered = true,
    shadow = true,
    children = <></>,
    other = <></>
  } = props;

  return (
    <div
      className={`${className} auth-card`}
      style={{
        backgroundImage: `url(${AuthBgImage})`,
        backgroundSize: 'auto',
        height: 'max-content',
        backgroundRepeat: 'no-repeat',
        paddingTop: paddingTop,
        backgroundPositionX: 'center'
      }}
    >
      <AuthLogo />
      <div className="flex items-center justify-center">
        <Card
          className="w-[400px]"
          bordered={bordered}
          style={{
            boxShadow: shadow ? '' : 'none'
          }}
          bodyStyle={{
            padding: '32px'
          }}
        >
          {children}
        </Card>
      </div>
      {other}
    </div>
  );
}

export default AuthCard;