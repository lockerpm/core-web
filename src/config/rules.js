import React from 'react'
import { Trans } from 'react-i18next'
import PATTERNS from './patterns'

export default {
  REQUIRED: (name = '', whitespace = true) => {
    return {
      required: true,
      whitespace: whitespace,
      message: <Trans i18nKey='validation.required' values={{ name: name }}/>
    }
  },
  INVALID: (name = '', pattern = '') => {
    return {
      pattern: PATTERNS[pattern],
      message: <Trans i18nKey='validation.invalid' values={{ name: name }}/>
    }
  },
  LATEST_LENGTH: (name = '', min = 0) => {
    return {
      min: min,
      type: 'string',
      message: <Trans i18nKey='validation.least_length' values={{ name: name, min: min }}/>
    }
  },
}
