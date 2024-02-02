import React, { useEffect, useMemo, useState } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import {
  List,
  Divider,
  Row,
  Col,
  Avatar,
  Tag,
  Space
} from '@lockerpm/design';

import {
  SafetyCertificateOutlined
} from "@ant-design/icons";

import { red } from '@ant-design/colors';

import itemsComponents from "../../../components/items";
import commonComponents from "../../../components/common";
import memberComponents from "../../../components/member";

import enterpriseMemberServices from "../../../services/enterprise-member";

import common from "../../../utils/common";
import global from "../../../config/global";

const { PasswordStrength, TextCopy } = itemsComponents;
const { PageHeader } = commonComponents;
const { Actions, Role } = memberComponents;

const Member = (props) => {
  const { t } = useTranslation();
  const location = useLocation();

  const currentPage = common.getRouterByLocation(location);
  const enterpriseId = currentPage?.params?.enterprise_id
  const memberId = currentPage?.params?.member_id

  const [loading, setLoading] = useState(false)
  const [member, setMember] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const data = useMemo(() => {
    if (!member?.id) {
      return []
    }
    return [
      {
        name: t('common.name'),
        value: <TextCopy value={member.full_name} />
      },
      {
        name: t('common.email_addresses'),
        value: <TextCopy value={member.email} />
      },
      {
        name: t('common.password'),
        value: <PasswordStrength
          score={member.security_score}
          showProgress={false}
        />
      },
      {
        name: t('security_tools.password_health.title'),
        value: <div style={{ color: red.primary }} className="font-semibold">
          <SafetyCertificateOutlined className="mr-2"/>
          {member.cipher_overview?.cipher0 || 0} {t('security_tools.password_health.very_weak')} 
        </div>
      },
      {
        name: t('common.role'),
        value: <Role
          record={member}
          enterpriseId={enterpriseId}
          className={''}
          onReload={() => fetchData()}
        />
      },
      {
        name: t('common.joined_at'),
        value: <TextCopy value={common.timeFromNow(member.access_time)} />
      },
      {
        name: t('common.group'),
        value: <Space size={[4, 4]} wrap>
        {
          (member.groups || []).map((g, i) => <Tag key={i}>
            {g}
          </Tag>)
        }
      </Space>
      },
    ]
  }, [member])

  const Status = useMemo(() => {
    const status = common.getStatus(member.status)
    return <Tag color={status.color}>
      {t(status?.label)}
    </Tag>
  }, [member])

  const fetchData = async () => {
    setLoading(true)
    await enterpriseMemberServices.get(enterpriseId, memberId).then((response) => {
      setMember(response)
    }).catch(() => {
      setMember({})
    })
    setLoading(false)
  }

  const deleteItem = () => {
    global.confirm(async () => {
      enterpriseMemberServices
        .remove(enterpriseId, member.id)
        .then(async () => {
          global.pushSuccess(t("notification.success.enterprise_members.deleted"))
          global.navigate(global.keys.ENTERPRISE_MEMBERS, { enterprise_id: enterpriseId }, {
            tad: 'active'
          })
        })
        .catch((error) => {
          global.pushError(error)
        })
    })
  }

  return (
    <div className="member-details layout-content">
      <PageHeader
        title={member.full_name}
        subtitle={member.email}
        actions={[]}
        Logo={() => <div className="mr-4">
          <Avatar
            size={48}
            src={member.avatar}
          />
        </div>}
        Right={() => <div className="flex items-center">
          {Status}
          <Actions
            size="medium"
            item={member}
            enterpriseId={enterpriseId}
            onDelete={() => deleteItem()}
            onReload={() => fetchData()}
          />
        </div>}
      />
      <List
        itemLayout="horizontal"
        dataSource={data}
        loading={loading}
        renderItem={(item, index) => (
          <List.Item>
            <Row className="w-full" align={'middle'}>
              <Col lg={8} md={8} sm={24} xs={24}>
                <p className="font-semibold">{item.name}</p>
              </Col>
              <Col lg={16} md={16} sm={24} xs={24}>
                {item.value}
              </Col>
            </Row>
          </List.Item>
        )}
      />
      <Divider className="my-1" />
    </div>
  );
}

export default Member;