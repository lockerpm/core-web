import Items from './items'
import Generate from './generate'
import Modals from './modals'
import Forms from './forms'
import Charts from './charts'

import ClientService from './ClientService'
import UploadFile from './UploadFile'
import PageHeader from './PageHeader'
import DisplayOtp from './DisplayOtp'
import CipherIcon from './CipherIcon'

import Vault from './vault'
import Folder from './folder'
import Otp from './otp'

export default {
  ...Items,
  ...Generate,
  ...Modals,
  ...Forms,
  ...Charts,

  ClientService,
  UploadFile,
  PageHeader,
  DisplayOtp,
  CipherIcon,
  
  Vault,
  Folder,
  Otp
}
