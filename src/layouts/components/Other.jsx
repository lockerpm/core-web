import React from 'react';
import { useSelector } from 'react-redux';

function Other(props) {
  const isMobile = useSelector((state) => state.system.isMobile);

  return (
    <div className={`${props.className} ${isMobile  ? 'mobile' : ''}`}>
    </div>
  );
}

export default Other;
