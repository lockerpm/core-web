import React, { useEffect } from 'react';
import { Spin } from '@lockerpm/design';

const Splash = () => {
  useEffect(() => {
  }, [])

  return (
    <div className="auth-page flex items-center">
      <Spin
        spinning={true}
        size={'large'}
      >
      </Spin>
    </div>
  );
}

export default Splash;
