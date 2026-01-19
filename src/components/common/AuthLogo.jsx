import React from "react";

import {
  Image
} from '@lockerpm/design';

import images from "../../assets/images";

const AuthLogo = (props) => {
  const { AuthLogoImg } = images;
  const {
    className = 'mb-8',
    height = 48
  } = props;
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        className='icon-logo'
        src={AuthLogoImg}
        preview={false}
        height={height}
      />
    </div>
  );
}

export default AuthLogo;