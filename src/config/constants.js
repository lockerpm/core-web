import { Trans } from 'react-i18next'

const FILE_TYPE = {
  JSON: 'json',
}

export default {
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
  SERVICE_SCOPE: 'secret',
  CLIENT_ID: 'web',
  FILE_TYPE,
  LANGUAGES: [
    {
      value: 'en',
      label: <Trans i18nKey='common.english' />,
    },
    {
      value: 'vi',
      label: <Trans i18nKey='common.vietnamese' />,
    },
  ],
  IMPORT_EXPORT_FILE_TYPES: [
    {
      value: FILE_TYPE.JSON,
      label: 'Json'
    }
  ],
  SMTP_PROVIDERS: [
    {
      name: 'Other SMTP provider',
      host: '',
      port: ''
    },
    {
      name: 'Gmail',
      host: 'smtp.gmail.com',
      port: '587'
    },
    {
      name: 'Microsoft Outlook',
      host: 'smtp.office365.com',
      port: '587'
    },
    {
      name: 'Yahoo',
      host: 'smtp.mail.yahoo.com',
      port: '587'
    },
    {
      name: 'Mailtrap Email Sending',
      host: 'live.smtp.mailtrap.io',
      port: '587'
    },
    {
      name: 'Mailgun',
      host: 'mtp.mailgun.org',
      port: '587'
    },
    {
      name: 'Apple mail',
      host: 'smtp.mail.me.com',
      port: '587'
    },
    {
      name: 'Mandrill',
      host: 'smtp.mandrillapp.com',
      port: '587'
    },
    {
      name: 'SparkPost',
      host: 'mtp.sparkpostmail.com',
      port: '587'
    },
    {
      name: 'Postmark',
      host: 'smtp.postmarkapp.com',
      port: '587'
    },
  ]
}
