import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Row,
  Col,
} from '@lockerpm/design';

import {
  ArrowRightOutlined
} from '@ant-design/icons';

import { gray } from '@ant-design/colors';

import pageHeaderComponents from "../page-header";

const PageHeader = (props) => {
  const {
    EmergencyAccessInvitations,
    Actions,
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
    Logo = () => <></>,
    Right = () => null
  } = props

  const { t } = useTranslation()
  const isMobile = useSelector((state) => state.system.isMobile);

  const isRight = useMemo(() => {
    return !!Right()
  }, [Right])

  return (
    <>
      <EmergencyAccessInvitations />
      <Row
        gutter={[24, 8]}
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
        <Col span={(isRight || actions.length > 0) ? 16 : 12} className="page-header__left flex items-center">
          <Logo />
          <div
            className="text-limited"
          >
            <h1
              className={`page-header__left--title font-semibold w-full text-limited text-limited__block ${isMarginTop ? 'text-2xl' : 'text-xl'}`}
              title={title}
            >
              {title}
            </h1>
            {
              ![null, undefined].includes(total) && <p
                className="page-header__left--subtitle mt-1"
                style={{ color: gray[1] }}
              >
                {t('common.total')}: {total}
              </p>
            }
            {
              subtitle && <p
                className="page-header__left--subtitle text-limited text-limited__block"
                title={subtitle}
              >
                {subtitle}
              </p>
            }
          </div>
        </Col>
        <Col span={(isRight || actions.length > 0) ? 8 : 12} className="page-header__right" align="right">
          <Row gutter={[8, 8]} justify="end">
            <Actions actions={actions}/>
            <Right />
          </Row>
        </Col>
      </Row>
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