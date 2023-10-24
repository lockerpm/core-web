import React, { useMemo, useState, useEffect } from 'react';
import {
  Form,
  Select,
  Avatar,
  List
} from '@lockerpm/design';

import {
  UserOutlined,
  GroupOutlined
} from '@ant-design/icons';

import { useSelector  } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from '../../../../../config/global';
import enterpriseServices from '../../../../../services/enterprise';
import sharingServices from '../../../../../services/sharing';
import common from '../../../../../utils/common';

function ShareMembers(props) {
  const {
    item
  } = props
  const { t } = useTranslation()

  const teams = useSelector((state) => state.enterprise.teams);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const myShares = useSelector((state) => state.share.myShares);

  const [memberGroupSearchText, setMemberGroupSearchText] = useState('')
  const [searching, setSearching] = useState(false)
  const [orgKey, setOrgKey] = useState(null)
  const [sharingKey, setSharingKey] = useState(null)
  const [members, setMembers] = useState([])
  const [groups, setGroups] = useState([])
  const [newMembers, setNewMembers] = useState([])
  const [newGroups, setNewGroups] = useState([])

  useEffect(() => {
    initData();
  }, [item])

  useEffect(() => {
    setTimeout(() => {
      if (memberGroupSearchText) {
        searchMembersGroups();
      }
    }, 300);
  }, [memberGroupSearchText])

  const initData = async () => {
    if (item?.organizationId) {
      const orgKey = await global.jsCore.cryptoService.getOrgKey(item.organizationId)
      setOrgKey(orgKey)
    } else {
      const shareKey = await global.jsCore.cryptoService.makeShareKey()
      setSharingKey(shareKey ? shareKey[0].encryptedString : null)
      setOrgKey(shareKey[1])
    }
  }

  const ItemAvatar = (props) => {
    const { item } = props
    return <div>
      {
        item.avatar && <Avatar size={20} src={item.avatar}/>
      }
      {
        !item.avatar && item.type !== 'group' && <UserOutlined />
      }
      {
        !item.avatar && item.type === 'group' && <GroupOutlined />
      }
    </div>
  }

  const memberGroupOptions = useMemo(() => {
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
    return options.map((d) => ({
      label: <div
        className='flex items-center'
        onClick={() => handleAddMemberGroup(d)}
      >
        <ItemAvatar item={d}/>
        <p className='ml-2'>{d.full_name || d.name}</p>
      </div>,
      value: d.email || d.id
    }))
    
  }, [members, groups, memberGroupSearchText])

  const currentMembers = useMemo(() => {
    const share = myShares.find(s => s.id === item?.organizationId) || { members: [] }
    return share.members.map(member => {
      return {
        ...member,
        username: member.email,
        status: member.status,
        role: member.role,
        id: member.id,
        key: null
      }
    }) || []
  }, [myShares, item])

  const currentGroups = useMemo(() => {
    const share = myShares.find(s => s.id === item?.organizationId) || { groups: [] }
    return share.groups.map(group => {
      return {
        ...group,
        type: 'group',
        key: null
      }
    }) || []
  }, [myShares, item])

  const shareMembersGroups = useMemo(() => {
    return [
      ...newMembers,
      ...members,
      ...newGroups,
      ...groups
    ]
  }, [newGroups, newMembers, currentGroups, currentMembers])

  const searchMembersGroups = async () => {
    setSearching(true)
    const result = await enterpriseServices.list_groups_members(
      teams[0].id,
      { query: memberGroupSearchText }
    );
    setMembers(result.members.filter(m => m.email !== userInfo.email))
    setGroups(result.groups.map(g => ({ ...g, type: 'group' })))
    setSearching(false)
  }

  const handleAddMemberGroup = async (item) => {
    if (item.type === 'group') {
      await addGroup(item)
    } else {
      await addMember(item)
    }
  }

  const addGroup = async (group) => {
    const { members } = await enterpriseServices.list_user_group_members(group.id)
    const groupMembers = await Promise.all(
      members
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
      id,
      name: group.name,
      role: 'member',
      type: 'group',
      isNew: true,
      members: groupMembers
    }])
  }

  const addMember = async (member) => {
    const members = await Promise.all(
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
            status: 'pending',
            role: 'member',
            avatar: m.avatar
          }
        }
      )
    )
    setNewMembers([ ...newMembers, ...members])
  }

  return (
    <div>
      <Form.Item
        className='mb-2'
        label={
          <p className='font-semibold'>
            {t('shares.new_share.personal_email_or_group')}
          </p>
        }
      >
        <Select
          placeholder={t('shares.new_share.personal_email_or_group_placeholder')}
          value={null}
          filterOption={false}
          showSearch={true}
          loading={searching}
          options={memberGroupOptions}
          onSearch={(v) => setMemberGroupSearchText(v)}
        />
      </Form.Item>
      <List
        itemLayout="horizontal"
        dataSource={shareMembersGroups}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<ItemAvatar item={item}/>}
              title={
                <div className='flex items-center font-regular'>
                  {item.username || item.name}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default ShareMembers;
