import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Input,
  Card,
} from '@lockerpm/design';

import {
  SearchOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import itemsComponents from '../items';
import commonComponents from '../common';

import common from '../../utils/common';
import global from '../../config/global';

function SearchContent(props) {
  const { NoData, SearchText, ImageIcon, RouterLink } = itemsComponents;
  const { CipherIcon } = commonComponents;
  const {
    onClose = () => {}
  } = props
  const { t } = useTranslation();

  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const allFolders = useSelector((state) => state.folder.allFolders)
  const allCollections = useSelector((state) => state.collection.allCollections)

  const [searchText, setSearchText] = useState(null);

  const filteredCiphers = useMemo(() => {
    return [
      ...allCiphers.filter((c) => c.name?.toLowerCase()?.includes(searchText?.toLowerCase()) || common.cipherSubtitle(c)?.toLowerCase()?.includes(searchText?.toLowerCase()))
    ]
  }, [searchText, allCiphers])

  const filteredFolders = useMemo(() => {
    return [
      ...allCollections,
      ...allFolders
    ].filter((c) => c.name?.toLowerCase()?.includes(searchText?.toLowerCase()))
  }, [searchText, allFolders])

  const items = useMemo(() => {
    return [
      ...filteredCiphers,
      ...filteredFolders.map((f) => ({ ...f, isFolder: true }))
    ]
  }, [filteredCiphers, filteredFolders])


  const onClickItem = (item) => {
    if (item.isFolder) {
      global.navigate(global.keys.FOLDER_DETAIL, { folder_id: item.id })
    } else {
      const cipherTypes = global.constants.CIPHER_TYPES
      let cipherType = cipherTypes.find((t) => t.type === item.type);
      if (item.isDeleted) {
        cipherType = cipherTypes.find((t) => t.isDeleted);
      }
      if (cipherType?.detailRouter) {
        global.navigate(cipherType?.detailRouter, { cipher_id: item.id })
      } else {
        global.navigate(cipherType?.listRouter, { }, { searchText })
      }
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
            prefix={<SearchOutlined />}
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
        items.length > 0 && <div className='flex flex-col gap-1'>
          <div className='flex items-center justify-between'>
            <p className='text-l font-semibold'>
              {t('common.results')} ({items.length})
            </p>
            <div onClick={onClose}>
              <RouterLink
                className={'font-semibold w-auto w-max'}
                label={'Xem tất cả'}
                routerName={global.keys.INVENTORY}
                routerParams={{}}
                routerQuery={{ searchText }}
              />
            </div>
          </div>
          <div className='search-results'>
            {
              items.map((item) => <div
                key={item.id}
                className='search-results__item p-1'
                onClick={() => onClickItem(item)}
              >
                <div className='flex items-center'>
                  {
                    item.isFolder ? <ImageIcon
                      name={item.isCollection ? 'folder-share' : 'folder'}
                      width={24}
                      height={24}
                    /> : <CipherIcon
                      item={item}
                      isDeleted={item?.isDeleted}
                      size={24}
                      type={item.type}
                    />
                  }
                  <div className='ml-2'>
                    <SearchText
                      className='text-xs font-semibold'
                      searchText={searchText}
                      value={item.name}
                    />
                    <div className='text-[10px] text-black-500'>
                      <SearchText
                        className='text-2xs'
                        searchText={searchText}
                        value={common.cipherSubtitle(item)}
                      />
                    </div>
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
