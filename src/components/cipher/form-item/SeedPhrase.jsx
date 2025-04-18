import React, { useState, useEffect } from 'react';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Input,
  Row,
  Col,
  Button
} from '@lockerpm/design';

import {
  PlusCircleOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';

function SeedPhrase(props) {
  const {
    value = '',
    readOnly = false,
    disabled = false,
    onChange = () => {}
  } = props
  const { t } = useTranslation()

  const MIN_WORD_COUNT = 12
  const MAX_WORD_COUNT = 24

  const [newValue, setNewValue] = useState([])

  useEffect(() => {
    const words = value?.split(' ')
    while (words.length < MIN_WORD_COUNT) {
      words.push('')
    }
    setNewValue(words)
  }, [value])

  const handleAddWord = () => {
    const words = [...newValue, '']
    onChange(words.join(' '))
  }

  const handleChangeWord = (newV, index) => {
    const newVArray = newV?.trim().split(' ');
    const maxLength = newValue.length > (index + newVArray.length) ? newValue.length : (index + newVArray.length)
    const leftArray = newValue?.slice(0, index) || [];
    const rightArray = newValue?.slice(index + newVArray.length, maxLength) || [];

    if (newVArray.length) {
      const words = [...leftArray, ...newVArray, ...rightArray]
      onChange(words.slice(0, MAX_WORD_COUNT).join(' '))
    }
  }

  const handleRemoveWord = (index) => {
    if (newValue.length <= MIN_WORD_COUNT) {
      return
    }
    const words = newValue.filter((v, i) => i !== index)
    onChange(words.join(' '))
  }

  return (
    <div className={props.className}>
      <Row gutter={[8, 8]}>
        {
          newValue.map((w, index) => <Col key={index} span={8}>
            <Input
              prefix={<p style={{ marginBottom: 0 }}>{index + 1}.</p>}
              suffix={
                newValue.length > MIN_WORD_COUNT && !disabled && !readOnly && <span
                  className='cursor-pointer'
                  onClick={() => handleRemoveWord(index)}
                >
                  <MinusCircleOutlined className='text-danger'/>
                </span>
              }
              value={w}
              readOnly={readOnly}
              disabled={disabled}
              onChange={(e) => handleChangeWord(e.target.value, index)}
            />
          </Col>)
        }
        {
          newValue.length < MAX_WORD_COUNT && !disabled && !readOnly && <Col span={8}>
            <Button
              className="w-full"
              type="primary"
              ghost
              icon={<PlusCircleOutlined />}
              onClick={() => handleAddWord()}
            >
              {t('button.add')}
            </Button>
          </Col>
        }
      </Row>
    </div>
  );
}

export default SeedPhrase;
