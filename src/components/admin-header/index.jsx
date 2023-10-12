import React, { useMemo } from "react";
import './css/index.scss'
import {
  Button,
  Row,
  Col,
  Avatar,
} from '@lockerpm/design';
import {
  BuildOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { gray } from '@ant-design/colors';

const AdminHeader = (props) => {
  const {
    isAvatar = false,
    avatarUrl,
    title = '',
    total = null,
    subtitle = '',
    actions = [],
    isEdit = false,
    isMarginTop = true,
    docLink = '',
    docLabel = '',
    EditForm = () => <></>
  } = props

  const { t } = useTranslation()
  const isMobile = useSelector((state) => state.system.isMobile);

  const height = useMemo(() => {
    if (isAvatar || subtitle || ![null, undefined].includes(total)) {
      return 60;
    }
    return 40
  }, [isAvatar, subtitle, total])

  return (
    <>
      <Row
        gutter={[24, 8]}
        className={`
          admin-header
          flex
          items-center
          justify-between
        `}
        style={{
          height: isMobile ? 'auto' : `${height}px`
        }}
      >
        <Col lg={actions.length > 0 ? 16 : 24} className="admin-header__left flex items-center">
          {
            isAvatar && avatarUrl && <Avatar
              className="mr-3"
              size={56}
              shape="square"
              src={avatarUrl}
            />
          }
          {
            isAvatar && !avatarUrl && <Avatar
              style={{ backgroundColor: '#1f2124' }}
              className="mr-3"
              size={56}
              shape="square"
              icon={<BuildOutlined />}
            />
          }
          <div className="w-full">
            {
              isEdit ? <EditForm /> : <h1
                className={`admin-header__left--title font-semibold ${isMarginTop ? 'text-2xl' : 'text-xl'}`}
              >
                {title}
              </h1>
            }
            {
              ![null, undefined].includes(total) && <p
                className="admin-header__left--subtitle mt-1"
                style={{ color: gray[1] }}
              >
                {t('common.total')}: {total}
              </p>
            }
          </div>
        </Col>
        <Col lg={actions.length > 0 ? 8 : 0} className="admin-header__right" align="right">
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
                    {a.label}
                  </Button>
                </Col>
              )}
          </Row>
        </Col>
      </Row>
      {
        subtitle && <p className="admin-header__left--subtitle mt-1">
          {subtitle}
        </p>
      }
      {
        docLink && <a
          className="admin-header__left--doc mt-1 flex items-center"
          href={docLink}
        >
          <span className="mr-2">{docLabel}</span>
          <ArrowRightOutlined />
        </a>
      }
    </>
  );
}

export default AdminHeader;