import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
  Space,
  Button,
  Drawer,
  Select,
  List,
  Avatar
} from "@lockerpm/design"

import {
  DeleteOutlined
} from "@ant-design/icons"

import itemsComponents from "../../../../../components/items"

import enterpriseGroupServices from "../../../../../services/enterprise-group"
import enterpriseMemberServices from "../../../../../services/enterprise-member"

import global from "../../../../../config/global"

function FormUsers(props) {
  const { RouterLink } = itemsComponents;
  const {
    visible = false,
    item = null,
    enterpriseId,
    onClose = () => { },
    onReload = () => { }
  } = props
  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [callingAPI, setCallingAPI] = useState(false)
  const [enterpriseMembers, setEnterpriseMembers] = useState([])
  const [groupMembers, setGroupMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    if (visible && item?.id) {
      fetchEnterpriseUsers();
      fetchGroupUsers();
    } else {
      setCallingAPI(false);
      setGroupMembers([]);
    }
  }, [visible, item])

  const filteredMembers = useMemo(() => {
    const groupMemberIds = groupMembers.map((m) => m.id)
    return enterpriseMembers.filter((m) => !groupMemberIds.includes(m.id)
      && m.full_name?.toLowerCase()?.includes(searchText)
      && m.email?.toLowerCase()?.includes(searchText)
    )
  }, [enterpriseMembers, searchText, groupMembers])

  const fetchEnterpriseUsers = async () => {
    setLoading(true);
    await enterpriseMemberServices
      .list(enterpriseId, { paging: 0, statuses: global.constants.STATUS.ACCESSED })
      .then((response) => {
        setEnterpriseMembers(response);
      }).catch(() => {
        setEnterpriseMembers([])
      })
    setLoading(false);
  }

  const fetchGroupUsers = async () => {
    setLoading(true);
    await enterpriseGroupServices.list_users(enterpriseId, item.id).then((response) => {
      setGroupMembers(response);
    }).catch(() => {
      setGroupMembers([])
    })
    setLoading(false);
  }

  const handleSave = async () => {
    setCallingAPI(true);
    await enterpriseGroupServices.update_users(enterpriseId, item.id, {
      members: groupMembers.map((m) => m.id)
    }).then(() => {
      global.pushSuccess(t('notification.success.enterprise_groups.users_updated'))
      onClose();
      onReload();
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false);
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t(`enterprise_groups.users`)}
        placement='right'
        onClose={onClose}
        open={visible}
        footer={
          <Space className='flex items-center justify-end'>
            <Button disabled={callingAPI} onClick={onClose}>
              {t("button.cancel")}
            </Button>
            <Button type='primary' loading={callingAPI} onClick={handleSave}>
              {t("button.save")}
            </Button>
          </Space>
        }
      >
        <Select
          className="w-full"
          disabled={loading}
          value={selectedMember}
          searchValue={searchText}
          showSearch
          placeholder={t('placeholder.select_users')}
          onSearch={(v) => setSearchText(v)}
          onChange={(v) => {
            setSelectedMember(null)
            if (v) {
              setGroupMembers([
                enterpriseMembers.find((m) => m.id === v),
                ...groupMembers
              ])
            }
          }}
          filterOption={false}
          options={[
            ...filteredMembers.map((m) => ({
              value: m.id,
              label: <div className='flex items-center'>
                <Avatar src={m.avatar} size={24} />
                <p className='text-xs ml-2'>{m.full_name || m.email}</p>
              </div>
            }))
          ]}
        />
        <p className="font-semibold my-4">
          {t(`enterprise_groups.users_of_group`)} ({groupMembers.length})
        </p>
        <List
          itemLayout="horizontal"
          loading={loading}
          dataSource={groupMembers}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setGroupMembers(groupMembers.filter((m) => m.id !== item.id))
                  }}
                />
              ]}
            >
              <div className='flex items-center' style={{ width: '240px' }}>
                <Avatar src={item.avatar} />
                <div className='ml-2'>
                  <RouterLink
                    className={"font-semibold text-limited"}
                    label={item.full_name}
                    routerName={global.keys.ENTERPRISE_MEMBER}
                    routerParams={{ enterprise_id: enterpriseId, member_id: item.id }}
                  />
                  <p className='text-xs text-limited'>{item.email}</p>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  )
}

export default FormUsers
