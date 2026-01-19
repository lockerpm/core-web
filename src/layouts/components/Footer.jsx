import React from 'react';
import '../css/footer.scss';

function Footer(props) {
  const { showFooter } = props;
  return (
    <>
      {
        showFooter && <div className={`${props.className}`}></div>
      }
    </>
  );
}

export default Footer;
