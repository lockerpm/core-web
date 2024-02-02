import React, { useMemo, useState, useEffect } from 'react';
import { useSelector  } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Form,
  Select,
  Avatar,
  List,
  Tag,
  Button
} from '@lockerpm/design';

import {
  UserOutlined,
  GroupOutlined,
  CloseOutlined
} from '@ant-design/icons';

import { red } from '@ant-design/colors';

import enterpriseServices from '../../../services/enterprise';
import sharingServices from '../../../services/sharing';
import commonServices from '../../../services/common';

import global from '../../../config/global';
import common from '../../../utils/common';

function ShareMembers(props) {
  const {
    orgKey,
    menuType = null,
    menuTypes = {},
    cipherOrFolder = null,
    currentMembers = [],
    currentGroups = [],
    newMembers = [],
    newGroups = [],
    shareMembersGroups = [],
    setCurrentMembers = () => {},
    setCurrentGroups = () => {},
    setNewMembers = () => {},
    setNewGroups = () => {},
    stopSharing = () => {}
  } = props
  const { t } = useTranslation()

  const teams = useSelector((state) => state.enterprise.teams);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [memberGroupSearchText, setMemberGroupSearchText] = useState('')
  const [searching, setSearching] = useState(false)
  const [callingAPI, setCallingAPI] = useState(false)

  const [members, setMembers] = useState([])
  const [groups, setGroups] = useState([])

  useEffect(() => {
    setTimeout(() => {
      if (memberGroupSearchText) {
        searchMembersGroups();
      }
    }, 300);
  }, [memberGroupSearchText])

  const ItemAvatar = (props) => {
    const { item, size = 20 } = props
    return <div>
      {
        item.avatar && <Avatar size={size} src={item.avatar}/>
      }
      {
        !item.avatar && item.type !== 'group' && <UserOutlined style={{ fontSize: size }}/>
      }
      {
        !item.avatar && item.type === 'group' && <GroupOutlined style={{ fontSize: size }}/>
      }
    </div>
  }

  const membersGroups = useMemo(() => {
    let options = [
      ...members,
      ...groups
    ]
    if (!options.length && global.patterns.EMAIL.test(memberGroupSearchText)) {
      options = [
        {
          email: memberGroupSearchText,
          full_name: memberGroupSearchText,
        }
      ]
    }
    return options
  }, [members, groups, memberGroupSearchText])

  const memberGroupOptions = useMemo(() => {
    return membersGroups.map((d) => ({
      label: <div
        className='flex items-center'
      >
        <ItemAvatar item={d}/>
        <p className='ml-2'>{d.full_name || d.name}</p>
      </div>,
      value: d.email || d.id,
      disabled: !!shareMembersGroups.find((item) => d.id === item.id || d.email === item.username)
    }))
    
  }, [membersGroups, shareMembersGroups])

  const searchMembersGroups = async () => {
    setSearching(true)
    if (teams.length > 0) {
      const result = await enterpriseServices.list_groups_members(
        teams[0]?.id,
        { query: memberGroupSearchText }
      );
      setMembers(result.members.filter(m => m.email !== userInfo.email))
      if (menuTypes.CIPHERS === menuType) {
        setGroups(result.groups.map(g => ({ ...g, type: 'group' })))
      } else {
        setGroups([])
      }
    }
    setSearching(false)
  }

  const handleAddMemberGroup = async (v) => {
    const item = membersGroups.find((d) => d.id === v || d.email === v)
    if (item.type === 'group') {
      await addGroup(item)
    } else {
      await addMember(item)
    }
  }

  const addGroup = async (group) => {
    const result = await enterpriseServices.list_user_group_members(group.id)
    const groupMembers = await Promise.all(
      result.members
        .filter(m => !!m.email)
        .map(async m => {
          const publicKey = m.public_key
          const key = publicKey
            ? await common.generateMemberKey(publicKey, orgKey)
            : null
          return {
            username: m.email,
            key
          }
        }
      )
    )
    setNewGroups([ ...newGroups, {
      id: group.id,
      name: group.name,
      role: global.constants.PERMISSION_ROLE.MEMBER,
      type: 'group',
      isNew: true,
      members: groupMembers
    }])
  }

  const addMember = async (member) => {
    const result = await Promise.all(
      [member]
        .filter(m => !!m.email)
        .map(async m => {
          const response = await sharingServices.get_public_key({ email: m.email })
          const key = response.public_key
            ? await common.generateMemberKey(response.public_key, orgKey)
            : null
          return {
            id: null,
            username: m.email,
            key,
            status: global.constants.STATUS.PENDING,
            role: global.constants.PERMISSION_ROLE.MEMBER,
            avatar: m.avatar,
            isNew: true,
          }
        }
      )
    )
    setNewMembers([ ...newMembers, ...result])
  }

  const handleChangePermission = async (item, value) => {
    if (item.id && !item.isNew && cipherOrFolder) {
      if (item.type === 'group') {
        await sharingServices.update_sharing_group(cipherOrFolder.organizationId, item.id, { role: value })
      } else {
        await sharingServices.update_sharing_member(cipherOrFolder.organizationId, item.id, { role: value })
      }
      await commonServices.get_my_shares();
    }
    if (item.type === 'group') {
      if (item.isNew) {
        setNewGroups(newGroups.map((g) => ({
          ...g,
          role: item.id === g.id ? value : g.role
        })))
      } else {
        setCurrentGroups(currentGroups.map((g) => ({
          ...g,
          role: item.id === g.id ? value : g.role
        })))
      }
    } else {
      if (item.isNew) {
        setNewMembers(newMembers.map((m) => ({
          ...m,
          role: item.username === m.username ? value : m.role
        })))
      } else {
        setCurrentMembers(currentMembers.map((m) => ({
          ...m,
          role: item.username === m.username ? value : m.role
        })))
      }
    }
  }

  const handleStopSharing = async (item) => {
    if (item.type === 'group') {
      if (item.isNew) {
        setNewGroups(newGroups.filter((g) => g.id !== item.id))
      } else {
        stopSharing(item);
        setCurrentGroups(currentGroups.filter((g) => g.id !== item.id))
      }
    } else {
      if (item.isNew) {
        setNewMembers(newMembers.filter((m) => m.username !== item.username))
      } else {
        stopSharing(item);
        setCurrentMembers(currentMembers.filter((m) => m.username !== item.username))
      }
    }
  }

  const handleConfirmMember = async (item) => {
    setCallingAPI(true)
    const publicKey = await sharingServices.get_public_key({ email: item.email })
    const key = await common.generateMemberKey(publicKey, orgKey)
    sharingServices.add_sharing_member(cipherOrFolder.organizationId, item.id, { key }).then(() => {
      global.pushSuccess(t('notification.success.sharing.confirm_member_success'))
      setNewMembers(newMembers.map((m) => ({
        ...m,
        status: item.username === m.username ? global.constants.STATUS.CONFIRMED : m.status
      })))
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false)
  }

  return (
    <div>
      <Form.Item
        className='mb-2'
        label={
          <p className='font-semibold'>
            { menuType === menuTypes.CIPHERS ? t('shares.new_share.personal_email_or_group') : t('shares.new_share.personal_email')}
          </p>
        }
      >
        <Select
          placeholder={ menuType === menuTypes.CIPHERS ? t('shares.new_share.personal_email_or_group_placeholder') :  t('shares.new_share.personal_email_placeholder')}
          value={null}
          filterOption={false}
          showSearch={true}
          loading={searching}
          options={memberGroupOptions}
          onSearch={(v) => setMemberGroupSearchText(v)}
          onChange={(v) => handleAddMemberGroup(v)}
        />
      </Form.Item>
      {
        shareMembersGroups.length > 0 && <List
          itemLayout="horizontal"
          dataSource={shareMembersGroups}
          className='share-members'
          header={
            <div className='flex items-center justify-between font-semibold'>
              <div style={{ width: 40 }}></div>
              <div className='flex-1'>
                {t('common.name')}
              </div>
              <div className='flex items-center'>
                <div style={{ width: 108 }}>
                  {t('shares.share_type')}
                </div>
                <div style={{ width: 88 }}>
                  {t('common.status')}
                </div>
              </div>
              <div style={{ width: 28 }}></div>
            </div>
          }
          renderItem={(item) => (
            <List.Item
              actions={[
                <span
                  style={{ color: red.primary }}
                  className='cursor-pointer'
                  onClick={() => handleStopSharing(item)}
                >
                  <CloseOutlined />
                </span>
              ]}
            >
              <List.Item.Meta
                avatar={<ItemAvatar item={item} size={24}/>}
                description={null}
                title={
                  <div className='flex items-center justify-between'>
                    <div
                      className='text-limited'
                      title={item.username || item.name}
                      style={{ width: 174, display: 'block !important' }}
                    >
                      {item.username || item.name}
                    </div>
                    <div className='flex items-center'>
                      <Select
                        size='small'
                        value={item.role}
                        className='mr-2'
                        style={{ width: 100 }}
                        options={global.constants.SHARE_PERMISSIONS.map((p) => ({ value: p.role, label: t(p.label) }))}
                        onChange={(v) => handleChangePermission(item, v)}
                      />
                      <div style={{ width: 80 }}>
                        {
                          (() => {
                            if (item.status === global.constants.STATUS.ACCEPTED) {
                              return <Button
                                size="small"
                                type="primary"
                                disabled={callingAPI}
                                onClick={() => handleConfirmMember(item)}
                              >
                                {t('button.confirm')}
                              </Button>
                            }
                            const status = item.status ? common.getStatus(item.status) : null
                            if (status) {
                              return <Tag color={status.color}>{t(status?.label)}</Tag>
                            }
                          })()
                        }
                      </div>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      }
    </div>
  );
}

export default ShareMembers;
