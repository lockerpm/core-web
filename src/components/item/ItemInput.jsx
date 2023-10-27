import React, { useEffect, useMemo, useState } from "react";
import {
  Input,
  Button,
  Divider
} from '@lockerpm/design';

import {
  CloseCircleOutlined
} from '@ant-design/icons';

import {
  TextCopy
} from '../../components'

import { useTranslation } from "react-i18next";
import global from "../../config/global";

import { red } from '@ant-design/colors';

const ItemInput = (props) => {
  const {
    type = 'username',
    note = null,
    value = [],
    items = [],
    disabled = false,
    onChange = () => {}
  } = props;
  const { t } = useTranslation()
  const [dValues, setDValues] = useState(value)
  const [newValues, setNewValues] = useState('')

  useEffect(() => {
    setDValues(value)
  }, [value])

  const pattern = useMemo(() => {
    if (type === 'email') {
      return global.patterns.EMAIL
    }
    if (type === 'ip') {
      return global.patterns.IP
    }
    return global.patterns.USERNAME
  }, [type])

  const handleChange = (value) => {
    setNewValues(value)
    if (value.includes(' ') || value.includes(',') || value.includes('/')) {
      handleEnter()
    }
  }

  const handleEnter = () => {
    let values = []
    if (newValues.includes('/')) {
      values = newValues.split('/')
    } else if (newValues.includes(' ')) {
      values = newValues.split(' ')
    } else if (newValues.includes(',')) {
      values = newValues.split(',')
    } else {
      values = [newValues]
    }
    values = values.filter(Boolean).filter((v) => pattern.test(v) && !value.includes(v))
    setNewValues('');
    setDValues([...value, ...values])
    onChange([...value, ...values])
  }

  const handleClose = (index) => {
    const values = value.filter((v, i) => i !== index)
    onChange(values)
  }

  return (
    <div className="item-input">
      <Input
        placeholder={t(`placeholder.${type}`)}
        value={newValues}
        disabled={disabled}
        onPressEnter={handleEnter}
        onChange={(e) => handleChange(e.target.value)}
      />
      <small className="my-1">
        {note}
      </small>
      <div className='list-values mt-3'>
        {
          dValues.map((v, index) => <div key={index}>
            <div
              className='flex items-center justify-between'
              key={index}
            >
              <TextCopy
                value={v}
                color={items.includes(v) ? red.primary : ''}
              />
              <Button
                icon={<CloseCircleOutlined />}
                type={'link'}
                size="small"
                danger
                onClick={() => handleClose(index)}
              />
            </div>
            <Divider className='my-2'/>
          </div>)
        }
      </div>
    </div>
  );
}

export default ItemInput;