import React, { } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
  Row,
  Col,
} from '@lockerpm/design';

import {
  ArrowRightOutlined
} from '@ant-design/icons';

import { gray } from '@ant-design/colors';

import Notice from "./page-header/Notice";

const PageHeader = (props) => {
  const {
    title = '',
    total = null,
    subtitle = '',
    description = '',
    actions = [],
    isEdit = false,
    isMarginTop = true,
    docLink = '',
    docLabel = '',
    Logo = () => <></>,
    EditForm = () => <></>,
    Right = () => <></>
  } = props

  const { t } = useTranslation()
  const isMobile = useSelector((state) => state.system.isMobile);

  return (
    <>
      <Notice />
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
        <Col lg={actions.length > 0 ? 16 : 12} className="page-header__left flex items-center">
          <div>
            <Logo />
          </div>
          <div className="w-full">
            {
              isEdit ? <EditForm /> : <h1
                className={`page-header__left--title font-semibold ${isMarginTop ? 'text-2xl' : 'text-xl'}`}
              >
                {title}
              </h1>
            }
            {
              ![null, undefined].includes(total) && <p
                className="page-header__left--subtitle mt-1"
                style={{ color: gray[1] }}
              >
                {t('common.total')}: {total}
              </p>
            }
            {
              subtitle && <p className="page-header__left--subtitle">
                {subtitle}
              </p>
            }
          </div>
        </Col>
        <Col lg={actions.length > 0 ? 8 : 12} className="page-header__right" align="right">
          <Row gutter={[8, 8]} justify="end">
            {
              actions.filter((a) => !a.hide).map((a) =>
                <Col key={a.key}>
                  <Button
                    size={a.size}
                    key={a.key}
                    type={a.type}
                    loading={a.loading}
                    danger={a.danger}
                    disabled={a.disabled}
                    onClick={() => a.click()}
                    icon={a.icon}
                  >
                    {isMobile ? '' : a.label}
                  </Button>
                </Col>
              )}
            {
              <Right />
            }
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