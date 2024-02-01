import Items from './items'
import Generate from './generate'
import Modals from './modals'
import Forms from './forms'
import Charts from './charts'

import ClientService from './ClientService'
import UploadFile from './UploadFile'
import PageHeader from './PageHeader'

export default {
  ...Items,
  ...Generate,
  ...Modals,
  ...Forms,
  ...Charts,

  ClientService,
  UploadFile,
  PageHeader,
}
