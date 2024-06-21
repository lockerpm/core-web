import React, { useEffect, useState } from "react";
import { } from 'react-redux';
import { } from "react-i18next";
import { useLocation } from "react-router-dom";

import {
  Spin,
  Row,
  Col,
} from '@lockerpm/design';


import authComponents from "../../auth/components";
import quickShareDetailComponents from "./components";

import quickShareServices from "../../../services/quick-share";

import common from "../../../utils/common";

import '../css/index.scss';

const ShareDetail = () => {
  const { Logo } = authComponents;
  const {
    Right,
    Bottom,
    NotFound,
    Content,
    VerifyEmail
  } = quickShareDetailComponents;
  const location = useLocation();

  const currentPage = common.getRouterByLocation(location);
  const key = currentPage?.hash?.replace('#', '') || null;
  const id = currentPage?.params?.id || null;

  const [loading, setLoading] = useState(false);
  const [requireOtp, setRequireOtp] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [cipher, setCipher] = useState(null);

  useEffect(() => {
    getCipher()
  }, [currentPage?.hash, id])

  const getCipher = async () => {
    setLoading(true);
    if (key && id) {
      await quickShareServices.access(id).then(async (res) => {
        if (res.require_otp) {
          const isSuccess = await checkTokensLocal()
          setRequireOtp(!isSuccess)
        } else {
          const cipher = await common.decryptCipher(res.cipher, key)
          setCipher(cipher)
        }
      }).catch(() => {
        setInvalid(true)
      })
    } else {
      setInvalid(true)
    }
    setLoading(false);
  }

  const checkTokensLocal = async () => {
    for (const key in localStorage) {
      if (key.startsWith('token_')) {
        const email = key.split('token_')[1]
        const token = common.getToken(email)
        if (token) {
          const isSuccess = await submitToken(token, email)
          if (isSuccess) {
            return true
          }
        }
      }
    }
    return false
  }

  const submitToken = async (token, email, keepToken = false) => {
    if (!token) {
      return false
    }
    return await quickShareServices.submit(id, { email, token }).then(async (res) => {
      const cipher = await common.decryptCipher(res.cipher, key)
      setCipher(cipher)
      setRequireOtp(false)
      return true
    }).catch(() => {
      if (!keepToken) {
        removeToken(email)
      }
      return false
    })
  }

  return (
    <div className="public-page">
      <Row>
        <Col lg={18} md={15} sm={24} xs={24}>
          <div className="max-w-2xl mx-auto px-6 py-6">
            <div className="text-center mb-6">
              <Logo />
            </div>
            <Spin spinning={loading}>
              <div style={{ minHeight: 200 }}>
                {
                  invalid && !cipher && <NotFound />
                }
                {
                  requireOtp && <VerifyEmail
                    sendId={id}
                    decryptKey={key}
                    setCipher={setCipher}
                    submitToken={submitToken}
                    setRequireOtp={setRequireOtp}
                  />
                }
                {
                  cipher && <Content
                    cipher={cipher}
                  />
                }
              </div>
            </Spin>
          </div>
        </Col>
        <Col lg={6} md={9} sm={24} xs={24}>
          <Right />
        </Col>
      </Row>
      <Bottom />
    </div>
  );
}

export default ShareDetail;