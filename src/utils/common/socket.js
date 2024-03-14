import global from "../../config/global";
import commonServices from "../../services/common";
import storeActions from '../../store/actions';
import syncServices from "../../services/sync";

import store from "./store";
import sync from "./sync";

const syncDataByWs = async (message) => {
  const eventType = message.type;
  global.store.dispatch(storeActions.updateSyncing(true))
  if (['cipher_share', 'collection_update', 'cipher_invitation'].includes(eventType)) {
    await commonServices.sync_data();
  } else if (eventType.includes('cipher')) {
    if (['cipher_update', 'cipher_delete', 'cipher_restore'].includes(eventType)) {
      if (eventType === 'cipher_update') {
        await sync.syncProfile();
      }
      if (message.data.id) {
        await sync.syncItems([message.data.id])
      }
      if (message.data.ids) {
        await sync.syncItems(message.data.ids)
      }
    } else if (eventType.includes('cipher_delete_permanent')) {
      await global.jsCore.cipherService.delete(message.data.ids);
      await store.getAllCiphers();
    } else {
      await commonServices.sync_data();
    }
  } else if (eventType.includes('folder')) {
    if (eventType.includes('update')) {
      const res = await syncServices.sync_folder(message.data.id);
      await global.jsCore.folderService.upsert([res])
      await store.getAllFolders();
    } else if (eventType.includes('delete')) {
      await global.jsCore.folderService.delete(message.data.ids);
      await store.getAllFolders();
    } else {
      await commonServices.sync_data();
    }
  } else if (eventType.includes('collection')) {
    if (eventType.includes('update')) {
      if (message.data.id) {
        const res = await syncServices.sync_collection(message.data.id);
        await global.jsCore.collectionService.upsert([res])
        await store.getAllCollections();
      }
    } else if (eventType.includes('delete')) {
      await global.jsCore.collectionService.delete(message.data.ids);
      await store.getAllCollections();
    } else {
      await commonServices.sync_data();
    }
  }
  global.store.dispatch(storeActions.updateSyncing(false))
}

export default {
  syncDataByWs
}