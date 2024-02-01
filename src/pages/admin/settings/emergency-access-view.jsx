import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import { } from "@ant-design/icons";

import components from "../../../components";
import Filter from "./components/security/emergency-access-view/Filter";
import TableData from "./components/security/emergency-access-view/TableData";
import ListData from "./components/security/emergency-access-view/ListData";
import ViewItem from "./components/security/emergency-access-view/ViewItem";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { CipherMapper } from "../../../core-js/src/constants";
import { SymmetricCryptoKey, EncString, Cipher } from "../../../core-js/src/models/domain";
import { CipherData } from "../../../core-js/src/models/data";

import global from "../../../config/global";
import common from "../../../utils/common";
import emergencyAccessServices from "../../../services/emergency-access";

const EmergencyAccessView = (props) => {
  const { PageHeader, Pagination }= components;
  const { } = props;
  const { t } = useTranslation();
  const location = useLocation();

  const currentPage = common.getRouterByLocation(location);
  const isMobile = useSelector((state) => state.system.isMobile);

  const [loading, setLoading] = useState(false);
  const [allCiphers, setAllCiphers] = useState([]);
  const [listGranted, setListGranted] = useState([]);
  const [viewVisible, setViewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    orderField: 'name',
    orderDirection: 'asc',
    searchText: '',
  });
  
  useEffect(() => {
    fetchGranted();
    if (currentPage.params?.contact_id) {
      fetchData();
    }
  }, [currentPage.params?.contact_id])

  const grantedEmergencyAccess = useMemo(() => {
    return listGranted.find((g) => g.id == currentPage.params?.contact_id)
  }, [currentPage.params?.contact_id])


  const filteredData = useMemo(() => {
    return common.paginationAndSortData(
      allCiphers,
      params,
      params.orderField,
      params.orderDirection,
      [
        (f) => params.searchText ? f.name?.toLowerCase().includes(params.searchText.toLowerCase() || '') : true
      ]
    )
  }, [allCiphers, JSON.stringify(params)])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      size: global.constants.PAGE_SIZE
    })
  }, [isMobile])

  const fetchGranted = async () => {
    await emergencyAccessServices.list_granted().then(res => {
      setListGranted(res)
    }).catch(() => {
      setListGranted([])
    })
  }

  const fetchData = async () => {
    setLoading(true)
    const contactId = currentPage.params?.contact_id
    const viewData = await emergencyAccessServices.view(contactId);
    const ciphers = await getAllCiphers(viewData)
    setAllCiphers(ciphers)
    setLoading(false)
  }

  const getAllCiphers = async (response) => {
    const allowedCipherTypes = Object.values(CipherMapper)
      .filter(i => !i.hideFromCipherList && !i.noCreate)
      .map(i => i.type)
    // Get enc key
    let encKey = null
    const keyBuffer = await global.jsCore.cryptoService.rsaDecrypt(response.key_encrypted)
    encKey = new SymmetricCryptoKey(keyBuffer)

    // Decrypt orgs
    const orgMap = {}
    try {
      const privateKey = await global.jsCore.cryptoService.decryptToBytes(
        new EncString(response.private_key),
        encKey
      )
      const promises = []
      const _getOrgKey = async (id, key) => {
        const decKeyBuffer = await global.jsCore.cryptoService.rsaDecrypt(
          key,
          privateKey
        )
        orgMap[id] = new SymmetricCryptoKey(decKeyBuffer)
      }
      response.organizations.forEach(org => {
        promises.push(_getOrgKey(org.id, org.key))
      })
      await Promise.allSettled(promises)
    } catch (error) {
      //
    }
    // Decrypt ciphers
    const decCiphers = []

    try {
      const ciphers = response.ciphers.filter(cipher =>
        allowedCipherTypes.includes(cipher.type)
      )
      const promises = []
      const _decryptCipher = async cipherResponse => {
        const cipherData = new CipherData(cipherResponse)
        const cipher = new Cipher(cipherData)
        const decCipher = await cipher.decrypt(
          orgMap[cipherResponse.organization_id] || encKey
        )
        decCiphers.push(decCipher)
      }
      ciphers.forEach(cipherResponse => {
        promises.push(_decryptCipher(cipherResponse))
      })
      await Promise.allSettled(promises)
    } catch (error) {
      //
    }

    // Done, process new types and sort
    const res = decCiphers.map(item => {
      const i = common.parseNotesOfNewTypes(item)
      return i
    })
    // res.sort(global.jsCore.cipherService.getLocaleSortingFunction())
    return res
  }

  const handleChangePage = (page, size) => {
    setParams({
      ...params,
      page,
      size
    })
  };

  const handleViewItem = (item = null) => {
    setSelectedItem(item);
    setViewVisible(true);
  }

  return (
    <div className=" layout-content">
      <PageHeader
        title={t('emergency_access_view.title')}
        total={filteredData.total}
        description={t('emergency_access_view.description', { owner: grantedEmergencyAccess?.full_name })}
        actions={[]}
      />
      {
        allCiphers.length > 0 && <Filter
          className={'mt-2'}
          params={params}
          loading={loading}
          setParams={(v) => setParams({ ...v, page: 1 })}
        />
      }
      {
        isMobile ? <ListData
          className="mt-4"
          loading={loading}
          data={filteredData.result}
          params={params}
          allCiphers={allCiphers}
          onReview={handleViewItem}
        /> : <TableData
          className="mt-4"
          loading={loading}
          data={filteredData.result}
          params={params}
          allCiphers={allCiphers}
          onReview={handleViewItem}
        />
      }
      {
        filteredData.total > global.constants.PAGE_SIZE && !isMobile && <Pagination
          params={params}
          total={filteredData.total}
          onChange={handleChangePage}
        />
      }
      <ViewItem
        visible={viewVisible}
        item={selectedItem}
        onClose={() => {
          setViewVisible(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

export default EmergencyAccessView;