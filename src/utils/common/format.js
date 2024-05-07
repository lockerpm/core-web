const formatCurrency = (value = 0, fixed = 0, currency = '') => {
  let newValue = value || 0
  if (fixed && `${value || 0}`.split('.')[1]?.length > fixed) {
    newValue = Number(value || 0).toFixed(fixed)
  }
  if (currency === '$') {
    return `${currency} ${newValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return `${newValue} ${currency}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const separatorNumber = (value = 0) => {
  return value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0
}

const convertCurrency = (value = 0, fixed = 0) => {
  if (value >= 1000000000) {
    return `${separatorNumber((value / 1000000000).toFixed(fixed))} T`
  }
  if (value >= 1000000) {
    return `${separatorNumber((value / 1000000).toFixed(fixed))} Tr`
  }
  if (value > 1000) {
    return `${separatorNumber((value / 1000).toFixed(fixed))} K`
  }
  return separatorNumber(value.toFixed(fixed))
}

const camelCaseToWords = (str) => {
  if (!str) {
    return ''
  }
  const newStr = str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/(\b[A-Z]{2,}\b)(?=[a-z])/g, '$1 ')
    .toLowerCase()
  return newStr ? newStr[0].toUpperCase() + newStr.slice(1) : newStr
}

const formatOTP = (otp) => {
  if (!otp) {
    return 'N/A'
  }
  const first = otp.slice(0, 3);
  const last = otp.slice(3, otp.length);
  return `${first} ${last}`
}

const formatText = (value, show) => {
  if (value && !show) {
    let result = ''
    for (let i = 0; i < value.length; i++) {
      if (value[i] === ' ') {
        result += ' '
      } else {
        result += '*'
      }
    }
    return result
  }
  return value
}

export default {
  formatCurrency,
  separatorNumber,
  convertCurrency,
  camelCaseToWords,
  formatOTP,
  formatText
}