export default {
  EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  LINK: /^(https?:\/\/)?((localhost|(\d{1,3}\.){3}\d{1,3}|\[[a-fA-F0-9:]+\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))(:\d+)?(\/[^\s]*)?$/,
  IP: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$/,
  USERNAME: /^.*$/,
  PORT: /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/gi,
  MONTH_YEAR: /^(0?[1-9]|1[012])\/([0-9][0-9])$/,
  CARD_NUMBER: /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
  EXPIRATION_YEAR: /^\d{2}$/,
  CVV: /^[0-9]{3,4}$/,
  NUMBER: /^(0|[1-9][0-9]*)$/,
  PASSPORT_NUMBER: /^(?!^0+$)[a-zA-Z0-9]{3,20}$/,
  LICENSE_NUMBER: /^[0-9a-zA-Z]{4,9}$/
}