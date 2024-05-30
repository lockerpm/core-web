
import moment from 'moment'
import dayjs from 'dayjs'
import common from '.'

require('dayjs/locale/en')
require('dayjs/locale/vi')

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)


const convertTime = time => {
  const hours = Math.floor(Number(time) / 60)
  const minutes = Number(time) % 60
  return `${hours}h${minutes}m`
}

const timeFromNow = time => {
  dayjs.locale(common.getLanguage())
  if (!time) {
    return ''
  }
  if (time && typeof time === 'number') {
    return dayjs(time * 1000).fromNow()
  }
  return dayjs(time).fromNow()
}

const convertDateTime = (date, format = 'HH:mm DD-MM-YYYY') => {
  dayjs.locale(common.getLanguage())
  if (date && typeof date === 'number') {
    return dayjs(date * 1000).format(format)
  }
  return dayjs(date).format(format)
}

const disabledDate = current => {
  return current && moment(current).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')
}

const disabledTime = (now, condition = true, type = 'hour') => {
  const range = (start, end) => {
    const result = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }
  if (condition) {
    return {
      disabledHours: () => type === 'hour' ? range(0, 23).filter(h => h <= moment(now).hour()) : [],
      disabledMinutes: () => type === 'minute' ? range(0, 59).filter(h => h <= moment(now).minute) : [],
      disabledSeconds: () => type === 'second' ? range(0, 59).filter(h => h <= moment(now).second) : [],
    }
  }
  return {
    disabledHours: () => []
  }
}

const getCurrentWeekday = date => {
  return (moment(date).weekday() + 2) > 7 ? 1 : (moment(date).weekday() + 2)
}

const convertDateNow = () => {
  const now = moment()
  const mOptions = [0, 15, 30, 45]
  const h = now.hours()
  const m = now.minutes()
  const lastM = mOptions.find(o => o > m)
  if (lastM) {
    return moment(moment().format(`YYYY/MM/DD ${h}:${lastM}:ss`))
  } else {
    return moment(moment().add(1, 'hours').format('YYYY/MM/DD HH:00:ss'))
  }
}

const getTimeByOption = (key, value = []) => {
  let dates = value
  if (key === 'last_week') {
    dates = [dayjs().add(-7, 'days'), dayjs()]
  } else if (key === 'last_month') {
    dates = [dayjs().add(-1, 'month'), dayjs()]
  }
  return dates
}

const convertCipherFieldDate = (date) => {
  dayjs.locale(common.getLanguage())
  const newDate = date.split('-').reverse();
  return dayjs(newDate.join('-'))
}

const displayTimes = (second) => {
  if (second === 1) {
    return {
      value: 1,
      label: 'second'
    }
  }
  if (second > 1 && second < 60) {
    return {
      value: second,
      label: 'seconds'
    }
  }
  if (second === 60) {
    return {
      value: 1,
      label: 'minute'
    }
  }
  if (second > 60 && second < 60 * 60) {
    return {
      value: second / 60,
      label: 'minutes'
    }
  }
  if (second === 60 * 60) {
    return {
      value: 1,
      label: 'hour'
    }
  }
  if (second > 60 * 60) {
    return {
      value: second / (60 * 60),
      label: 'hours'
    }
  }
}

export default {
  convertTime,
  timeFromNow,
  convertDateTime,
  disabledDate,
  disabledTime,
  getCurrentWeekday,
  convertDateNow,
  getTimeByOption,
  convertCipherFieldDate,
  displayTimes
}
