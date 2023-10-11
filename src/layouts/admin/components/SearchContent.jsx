import React, { useMemo, useState, useEffect } from 'react';
import {
  Input,
  Card,
} from '@lockerpm/design';
import {
  SearchOutlined,
  LoadingOutlined,
  CloseOutlined,
  ProjectOutlined,
} from '@ant-design/icons';

import { gray } from '@ant-design/colors';

import { NoData, SearchText } from '../../../components'

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

function SearchContent(props) {
  const {
    onClose = () => {}
  } = props
  const { t } = useTranslation();
  const defaultSize = 5;

  const [searchText, setSearchText] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
  }, [])

  const items = useMemo(() => {
    return []
  }, [searchText])


  const onClickItem = (item) => {
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
                <div className='flex items-center'>
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
                        {item.name}
                      </small>
                    </p>
                  </div>
                </div>
              </div>)
            }
          </div>
        </div>
      }
    </Card>
  );
}

export default SearchContent;
