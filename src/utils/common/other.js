import global from '../../config/global';
import { Trans } from 'react-i18next';

const has = Object.prototype.hasOwnProperty

const isDiff = (A, B) => JSON.stringify(A) !== JSON.stringify(B)

const isEmpty = prop => {
  return (
    prop === null ||
    prop === undefined ||
    (has.call(prop, 'length') && prop.length === 0) ||
    (prop.constructor === Object && Object.keys(prop).length === 0)
  )
}

const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

const scrollToTop = () => {
  const layoutContent = document.querySelector('.layout-content')
  if (layoutContent) {
    layoutContent.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }
}

const getColorByIndex = index => {
  const colors = require('@ant-design/colors')
  const newColors = []
  Object.keys(colors).forEach(k => {
    if (Array.isArray(colors[k])) {
      newColors.push(colors[k])
    }
  })
  const colorTotal = newColors.length * newColors[0].length
  let i = index
  if (index >= colorTotal ) {
    i = index - colorTotal
  }
  const key1 = i % newColors.length
  const key2 = Math.floor((i + 1) / newColors.length)
  return newColors[key1][key2]
}

const openNewTab = (link) => {
  if (!link.match(/^https?:\/\//i)) {
    link = 'http://' + link
  }
  const regex = /^(ftp|http|https):\/\/[^ "]+$/
  if (regex.test(link)) {
    window.open(link, '_blank')
  } else {
    this.notify(this.$t('errors.invalid_url'), 'warning')
  }
}

const copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  global.pushSuccess(<Trans i18nKey='notification.success.copied' />)
};

export default {
  isDiff,
  isEmpty,
  uuidv4,
  randomColor,
  scrollToTop,
  getColorByIndex,
  openNewTab,
  copyToClipboard
}