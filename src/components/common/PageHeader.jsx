import React from "react";
import { useSelector } from 'react-redux';

import {
  Row,
} from '@lockerpm/design';

import {
  ArrowRightOutlined
} from '@ant-design/icons';

import pageHeaderComponents from "../page-header";

const PageHeader = (props) => {
  const {
    Actions,
    HeaderTitle
  } = pageHeaderComponents;
  const {
    title = '',
    total = null,
    subtitle = '',
    description = '',
    actions = [],
    isMarginTop = true,
    docLink = '',
    docLabel = '',
    isBack = true,
    Back = () => <></>,
    Logo = () => <></>,
    Right = () => null
  } = props

  const isMobile = useSelector((state) => state.system.isMobile);

  return (
    <>
      <div
        className={`
          page-header
          flex
          items-center
          justify-between
        `}
        style={{
          height: (isMobile || description) ? 'auto' : `${60}px`,
        }}
      >
        <div className="page-header__left flex items-center mr-2">
          <div className="flex items-center">
            {
              isBack && <Back />
            }
            <Logo />
          </div>
          <HeaderTitle
            title={title}
            total={total}
            subtitle={subtitle}
            isMarginTop={isMarginTop}
          />
        </div>
        <div className="page-header__right">
          <Row gutter={[8, 8]} justify="end">
            <Actions actions={actions}/>
            <Right />
          </Row>
        </div>
      </div>
      {
        description && <p className="page-header__left--subtitle mt-2">
          {description}
        </p>
      }
      {
        docLink && <a
          className="page-header__left--doc mt-1 flex items-center"
          href={docLink}
        >
          <span className="mr-2">{docLabel}</span>
          <ArrowRightOutlined />
        </a>
      }
    </>
  );
}

export default PageHeader;