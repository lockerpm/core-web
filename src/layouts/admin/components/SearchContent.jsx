import React, { useMemo, useState, useEffect } from 'react';
import {
  Input,
  Card,
  Tag
} from '@lockerpm/design';
import {
  SearchOutlined,
  LoadingOutlined,
  CloseOutlined,
  ProjectOutlined,
  SafetyOutlined,
  GlobalOutlined
} from '@ant-design/icons';

import { gray } from '@ant-design/colors';

import { NoData, SearchText } from '../../../components'

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import global from '../../../config/global';

import {
  getEnvironment
} from '../../../utils/common'

function SearchAllForm(props) {
  const {
    onClose = () => {}
  } = props
  const { t } = useTranslation();
  const defaultSize = 5;
  const workspaces = useSelector((state) => state.workspace.workspaces)
  const projects = useSelector((state) => state.project.projects)

  const [searchText, setSearchText] = useState(null);
  const [searching, setSearching] = useState(false);
  const [secrets, setSecrets] = useState([]);
  const [environments, setEnvironments] = useState([]);

  const newProjects = useMemo(() => {
    return projects?.map((p) => ({
      ...p,
      workspace: workspaces?.find((w) => w.id ===  p.organization.id) || {}
    })) || []
  }, [projects, workspaces])

  const projectIds = useMemo(() => {
    return projects?.map((p) => p.id) || []
  }, [projects])

  useEffect(() => {
    fetchSecrets();
    fetchEnvironments();
  }, [projectIds])

  const items = useMemo(() => {
    const filteredProjects = newProjects
      .filter(p => p.name.toLowerCase().includes((searchText || '').toLowerCase()))
      .slice(0, defaultSize)
    const filteredSecrets = secrets
      .filter((s) => (s.secret.key || '').toLowerCase().includes((searchText || '').toLowerCase()))
      .map((s) => ({
        ...s,
        project: newProjects.find((p) => p.id === s.organizationId)
      }))
      .slice(0, defaultSize)
    const filteredEnvironments = environments
      .filter((e) => (e.environment.name || '').toLowerCase().includes((searchText || '').toLowerCase()))
      .map((e) => ({
        ...e,
        project: newProjects.find((p) => p.id === e.organizationId)
      }))
      .slice(0, defaultSize)
    return [
      ...filteredProjects.map((p) => ({ ...p, item_type: 'project' })),
      ...filteredSecrets.map((p) => ({ ...p, item_type: 'secret' })),
      ...filteredEnvironments.map((p) => ({ ...p, item_type: 'environment' })),
    ]
  }, [newProjects, secrets, environments, searchText])

  const fetchSecrets = async () => {
    const secrets = await secretServices.list_ciphers();
    setSecrets(secrets.filter((s) => projectIds.includes(s.organizationId)));
  }

  const fetchEnvironments = async () => {
    const environments = await environmentServices.list_ciphers();
    setEnvironments(environments.filter((e) => projectIds.includes(e.organizationId)));
  }

  const onClickItem = (item) => {
    if (item.item_type === 'project') {
      global.navigate('PROJECT_SECRETS', { workspace_id: item.workspace.id, project_id: item.id })
    } else if (item.item_type === 'secret') {
      global.navigate('PROJECT_SECRETS', { workspace_id: item.project.workspace.id, project_id: item.project.id }, { key: item.secret.key })
    } else if (item.item_type === 'environment') {
      global.navigate('PROJECT_ENVIRONMENTS', { workspace_id: item.project.workspace.id, project_id: item.project.id }, { name: item.environment.name })
    }
    onClose()
  }

  return (
    <Card
      id='search-content'
      className={props.className}
      hoverable
      headStyle={{
        minHeight: 34,
        padding: 0,
      }}
      bodyStyle={{
        display: searchText ? 'block' : 'none',
        overflow: 'auto',
        minHeight: 150,
        maxHeight: 500,
        padding: 12
      }}
      title={
        <div className='search-input w-full flex items-center justify-between pr-2'>
          <Input
            size="medium"
            bordered={false}
            autoFocus={true}
            prefix={searching ? <LoadingOutlined /> : <SearchOutlined />}
            placeholder={t('placeholder.search')}
            onInput={(e) => setSearchText(e.target.value)}
          />
          <CloseOutlined
            className='cursor-pointer'
            onClick={() => onClose()}
            style={{ fontSize: 14 }}
          />
        </div>
      }
    >
      {
        items.length <= 0 && <NoData />
      }
      {
        items.length > 0 && <div>
          <p className='text-l font-semibold mb-1'>
            {t('common.results')}
          </p>
          <div className='search-results'>
            {
              items.map((item) => <div
                key={item.id}
                className='search-results__item p-1'
                onClick={() => onClickItem(item)}
              >
                {
                  item.item_type === 'project' && <div className='flex items-center'>
                    <ProjectOutlined
                      className='text-primary'
                      style={{ fontSize: 24 }}
                    />
                    <div className='ml-2'>
                      <SearchText
                        className='text-xs font-semibold'
                        searchText={searchText}
                        value={item.name}
                      />
                      <p className='text-xs'>
                        <small style={{ color: gray[1], fontSize: 10 }}>
                          {item.workspace?.name} {'>'} {item.name}
                        </small>
                      </p>
                    </div>
                  </div>
                }
                {
                  item.item_type === 'secret' && <div className='flex items-center'>
                    <SafetyOutlined
                      className='text-primary'
                      style={{ fontSize: 24 }}
                    />
                    <div className='ml-2'>
                      <div className='flex items-center'>
                        <SearchText
                          className='text-xs font-semibold mr-2'
                          searchText={searchText}
                          value={item.secret.key}
                        />
                        {
                          (() => {
                            const environment = getEnvironment(item.environmentId, environments.filter((e) => e.organizationId == item.organizationId))
                            return environment ? <Tag
                              style={{ height: 16, fontSize: 12, lineHeight: '12px', color: gray[6] }}
                              color={environment?.color}
                            >
                              {environment?.name}
                            </Tag> : <></>
                          })()
                        }
                      </div>
                      <p className='text-xs'>
                        <small style={{ color: gray[1], fontSize: 10 }}>
                          {item.project.workspace.name} {'>'} {item.project.name} {'>'} {t('secrets.title')}
                        </small>
                      </p>
                    </div>
                  </div>
                }
                {
                  item.item_type === 'environment' && <div className='flex items-center'>
                    <GlobalOutlined
                      className='text-primary'
                      style={{ fontSize: 24 }}
                    />
                    <div className='ml-2'>
                      <SearchText
                        className='text-xs font-semibold'
                        searchText={searchText}
                        value={item.environment.name}
                      />
                      <p className='text-xs'>
                        <small style={{ color: gray[1], fontSize: 10 }}>
                          {item.project.workspace.name} {'>'} {item.project.name} {'>'} {t('environments.title')}
                        </small>
                      </p>
                    </div>
                  </div>
                }
              </div>)
            }
          </div>
        </div>
      }
      
    </Card>
  );
}

export default SearchAllForm;
